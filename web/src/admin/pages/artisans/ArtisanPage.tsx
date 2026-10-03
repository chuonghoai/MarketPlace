import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artisanService, type Artisan } from '../../features/artisans/services/artisan.service';

export const ArtisanPage = () => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      try {
        const res = await artisanService.getAll(1, 20, search);
        setArtisans(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchArtisans();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-ink">Quản lý nghệ danh</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm nghệ danh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-border-subtle bg-surface-container focus:outline-none focus:border-primary text-text-ink transition-colors"
            />
          </div>
          <Link to="/admin/artisans/create" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors">
            <span className="material-symbols-outlined">add</span>
            Thêm mới
          </Link>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Đang tải dữ liệu...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-container border-b border-border-subtle">
              <tr>
                <th className="p-4 text-sm font-semibold text-text-muted">Nghệ danh</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Số lượng sản phẩm</th>
                <th className="p-4 text-sm font-semibold text-text-muted">Ngày sinh</th>
                <th className="p-4 text-sm font-semibold text-text-muted text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map(art => (
                <tr 
                  key={art.id} 
                  onClick={() => navigate(`/admin/artisans/${art.id}`)}
                  className="border-b border-border-subtle hover:bg-surface-container/50 cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-border-medium overflow-hidden">
                        {art.avatar ? (
                          <img src={art.avatar} alt={art.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-text-muted">person</span>
                        )}
                      </div>
                      <span className="font-semibold text-text-ink">{art.fullName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-ink">{art.productCount || 0}</td>
                  <td className="p-4 text-muted">{art.birthDate ? new Date(art.birthDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/admin/artisans/${art.id}`} className="text-text-muted hover:text-primary mr-3 inline-flex">
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <button className="text-text-muted hover:text-error inline-flex">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {artisans.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-muted">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
