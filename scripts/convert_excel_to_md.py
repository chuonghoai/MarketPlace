import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

def clean_num(val):
    val = str(val).strip()
    if val.endswith('.0'):
        return val[:-2]
    return val

def escape_md(val):
    if val is None:
        return ''
    s = str(val).strip()
    # Replace internal newlines with <br>
    s = s.replace('\r\n', '\n').replace('\r', '\n')
    s = s.replace('\n', '<br>')
    # Escape pipe characters
    s = s.replace('|', '\\|')
    return s

def parse_excel(file_path):
    z = zipfile.ZipFile(file_path)
    
    # 1. Parse shared strings
    strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_xml = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in ss_xml:
            strings.append(''.join([t.text or '' for t in si.iter() if t.tag.endswith('t')]))
            
    # 2. Parse workbook & rels for sheet list
    wb_xml = ET.fromstring(z.read('xl/workbook.xml'))
    rels_xml = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rel_map = {r.attrib['Id']: r.attrib['Target'] for r in rels_xml}
    
    sheets = []
    for s in wb_xml.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheets'):
        name = s.attrib['name']
        r_id = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        target = rel_map[r_id]
        if not target.startswith('xl/'):
            target = 'xl/' + target
        sheets.append((name, target))
        
    return z, strings, sheets

def read_sheet_rows(z, strings, target_path):
    s_xml = ET.fromstring(z.read(target_path))
    sheet_data = None
    for child in s_xml:
        if child.tag.endswith('sheetData'):
            sheet_data = child
            break
            
    rows = {}
    if sheet_data is None:
        return rows
        
    for r in sheet_data:
        r_num = int(r.attrib.get('r', 0))
        cells = {}
        for c in r:
            ref = c.attrib.get('r')
            m = re.match(r'([A-Z]+)(\d+)', ref)
            if not m:
                continue
            col = m.group(1)
            t = c.attrib.get('t')
            v = None
            for ch in c:
                if ch.tag.endswith('v'):
                    v = ch
                    break
            val = ''
            if v is not None and v.text is not None:
                val = strings[int(v.text)] if t == 's' else v.text
            cells[col] = val.strip()
        rows[r_num] = cells
    return rows

def convert_summary_sheet(rows):
    lines = [
        '# Tổng Hợp Kiểm Thử Hộp Đen (Black Box Testing) - MarketPlace',
        '',
        '> **File nguồn:** `KiemThuHopDen_MKP.xlsx`  ',
        '> **Tổng hợp UseCase & Kịch bản kiểm thử hệ thống**',
        '',
        '| STT | UseCase | Người phụ trách | Tổng Số TestCase | TestCase ID | Số TC Pass | Fail |',
        '| :---: | :--- | :--- | :---: | :--- | :---: | :---: |'
    ]
    
    for r_num in sorted(rows.keys()):
        if r_num == 1:
            continue
        row = rows[r_num]
        stt = clean_num(row.get('A', ''))
        uc = row.get('B', '')
        assignee = row.get('C', '')
        total_tc = clean_num(row.get('D', ''))
        raw_tc_ids = row.get('E', '')
        pass_tc = clean_num(row.get('F', ''))
        fail_tc = clean_num(row.get('G', ''))
        
        # Format TestCase IDs with markdown links
        tc_tokens = re.split(r'[\r\n\s]+', raw_tc_ids.strip())
        linked_tc_ids = []
        for token in tc_tokens:
            token = token.strip()
            if not token:
                continue
            if token.startswith('MKP_'):
                linked_tc_ids.append(f'[{token}]({token}.md)')
            else:
                linked_tc_ids.append(token)
        tc_ids_formatted = '<br>'.join(linked_tc_ids)
        
        # Summary row at bottom
        if 'tổng' in uc.lower() or 'tổng' in stt.lower() or r_num == 25:
            stt_str = f'**{stt}**' if stt else ''
            uc_str = f'**{uc}**' if uc else '**Tổng cộng**'
            total_str = f'**{total_tc}**' if total_tc else ''
            pass_str = f'**{pass_tc}**' if pass_tc else ''
            fail_str = f'**{fail_tc}**' if fail_tc else ''
            lines.append(f'| {stt_str} | {uc_str} | {assignee} | {total_str} | {tc_ids_formatted} | {pass_str} | {fail_str} |')
        else:
            lines.append(f'| {stt} | {escape_md(uc)} | {escape_md(assignee)} | {total_tc} | {tc_ids_formatted} | {pass_tc} | {fail_tc} |')
            
    lines.append('')
    return '\n'.join(lines)

def convert_testcase_sheet(rows, sheet_name):
    r1 = rows.get(1, {})
    tc_id = r1.get('C', sheet_name)
    tc_desc = r1.get('F', '')
    
    r2 = rows.get(2, {})
    creator = r2.get('C', '')
    reviewer = r2.get('F', '')
    version = clean_num(r2.get('J', '1.0'))
    
    r4 = rows.get(4, {})
    log_content = r4.get('C', '')
    
    r6 = rows.get(6, {})
    tester = r6.get('C', '')
    date_str = r6.get('D', '')
    if date_str.startswith('Ngày kiểm thử:'):
        date_str = date_str.replace('Ngày kiểm thử:', '').strip()
    summary_result = r6.get('J', '')
    
    # Format badge for summary result
    badge_result = summary_result
    if summary_result.lower() == 'pass':
        badge_result = '**Pass**'
    elif summary_result.lower() == 'fail':
        badge_result = '**Fail**'

    lines = [
        f'# {tc_id} - {tc_desc}',
        '',
        '[⬅ Quay lại Danh sách Tổng Hợp](TongHop.md)',
        '',
        '---',
        '',
        '## 1. Thông tin Test Case',
        '',
        '| Mã Test Case (ID) | **' + escape_md(tc_id) + '** | Mô tả Test Case | **' + escape_md(tc_desc) + '** | | |',
        '| :--- | :--- | :--- | :--- | :--- | :--- |',
        f'| **Người tạo** | {escape_md(creator)} | **Người duyệt** | {escape_md(reviewer)} | **Phiên bản** | {escape_md(version)} |',
        f'| **Nhật ký kiểm thử** | {escape_md(log_content)} | | | | |',
        f'| **Người kiểm thử** | {escape_md(tester)} | **Ngày kiểm thử** | {escape_md(date_str)} | **Kết quả tổng hợp** | {badge_result} |',
        '',
        '---',
        '',
        '## 2. Điều kiện tiên quyết & Dữ liệu kiểm thử',
        '',
        '| S # | Điều kiện tiên quyết: | S # | Dữ liệu kiểm thử: |',
        '| :---: | :--- | :---: | :--- |'
    ]
    
    # Rows 9 to 14: Prerequisites (cols A, B) & Test Data (cols F, G)
    for r_num in range(9, 15):
        r = rows.get(r_num, {})
        s_pre = clean_num(r.get('A', ''))
        pre_val = r.get('B', '')
        s_data = clean_num(r.get('F', ''))
        data_val = r.get('G', '')
        
        # Only add line if at least one side has content
        if pre_val or data_val:
            lines.append(f'| {s_pre} | {escape_md(pre_val)} | {s_data} | {escape_md(data_val)} |')
            
    lines.extend([
        '',
        '---',
        '',
        '## 3. Kịch bản kiểm thử (Scenario)',
        '',
        '| Bước # | Chi tiết các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Đánh giá (Pass/Fail) |',
        '| :---: | :--- | :--- | :--- | :---: |'
    ])
    
    # Rows 19 onwards: Scenario steps
    for r_num in range(18, max(rows.keys()) + 1 if rows else 25):
        r = rows.get(r_num, {})
        step_num = clean_num(r.get('A', ''))
        action = r.get('B', '')
        expected = r.get('D', '')
        actual = r.get('F', '')
        evaluation = r.get('I', '')
        
        if any([step_num, action, expected, actual, evaluation]):
            eval_badge = evaluation
            if evaluation.lower() == 'pass':
                eval_badge = 'Pass'
            elif evaluation.lower() == 'fail':
                eval_badge = '**Fail**'
            lines.append(f'| {step_num} | {escape_md(action)} | {escape_md(expected)} | {escape_md(actual)} | {eval_badge} |')
            
    lines.append('')
    return '\n'.join(lines)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(base_dir, 'KiemThuHopDen_MKP.xlsx')
    output_dir = os.path.join(base_dir, 'docs', 'black_box_testing')
    
    if len(sys.argv) > 1:
        excel_path = sys.argv[1]
    if len(sys.argv) > 2:
        output_dir = sys.argv[2]
        
    print(f'Loading Excel file: {excel_path}')
    z, strings, sheets = parse_excel(excel_path)
    print(f'Total sheets found: {len(sheets)}')
    
    os.makedirs(output_dir, exist_ok=True)
    
    converted_count = 0
    for idx, (sheet_name, sheet_target) in enumerate(sheets):
        rows = read_sheet_rows(z, strings, sheet_target)
        
        if idx == 0 or sheet_name == 'Tổng Hợp':
            file_name = 'TongHop.md'
            md_content = convert_summary_sheet(rows)
        else:
            file_name = f'{sheet_name}.md'
            md_content = convert_testcase_sheet(rows, sheet_name)
            
        out_file_path = os.path.join(output_dir, file_name)
        with open(out_file_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        converted_count += 1
        
    print(f'Successfully converted {converted_count} sheets to {output_dir}')

if __name__ == '__main__':
    main()
