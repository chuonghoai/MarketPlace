import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { artisanService, type Artisan } from '../../features/artisans/services/artisan.service';
import { SelectProductModal } from './components/SelectProductModal';
import { mediaService } from '../../../features/media/services/media.service';

export const ArtisanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<Artisan>>({
    fullName: '',
    avatar: '',
    birthDate: ''
  });

  const [artisanInfo, setArtisanInfo] = useState<any>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(!id);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode) {
      loadArtisan();
    }
  }, [id]);

  const loadArtisan = async () => {
    setLoading(true);
    try {
      const res = await artisanService.getById(id as string);
      setArtisanInfo(res);
      setFormData({
        fullName: res.fullName,
        avatar: res.avatar || '',
        birthDate: res.birthDate ? res.birthDate.substring(0, 10) : ''
      });
    } catch (error) {
      console.error(error);
      alert('Không thể tải dữ liệu nghệ danh');
      navigate('/admin/artisans');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const results = await mediaService.uploadMultipleFiles([file], 'artisans');
      if (results && results.length > 0) {
        setFormData(prev => ({ ...prev, avatar: results[0].url }));
      } else {
        alert('Lỗi upload ảnh, vui lòng thử lại.');
      }
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!formData.fullName?.trim()) {
      alert('Vui lòng nhập họ tên nghệ danh.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        birthDate: formData.birthDate ? formData.birthDate : undefined
      };

      if (isEditMode) {
        await artisanService.update(id as string, payload);
        alert('Cập nhật thành công!');
        setIsEditing(false);
        loadArtisan();
      } else {
        const res = await artisanService.create(payload);
        alert('Thêm mới thành công!');
        navigate(`/admin/artisans/${res.id}`);
      }
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi lưu.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProducts = async (finalProductIds: string[]) => {
    if (!isEditMode) return;

    try {
      await artisanService.updateProducts(id as string, finalProductIds);
      loadArtisan();
    } catch (error) {
      console.error(error);
      alert('Lỗi khi cập nhật sản phẩm');
    }
    setIsModalOpen(false);
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!window.confirm('Bạn có chắc muốn gỡ sản phẩm này khỏi nghệ danh?')) return;
    const existingIds = artisanInfo?.products?.map((p: any) => p.id) || [];
    const updatedIds = existingIds.filter((pId: string) => pId !== productId);
    try {
      await artisanService.updateProducts(id as string, updatedIds);
      loadArtisan();
    } catch (error) {
      console.error(error);
      alert('Lỗi khi gỡ sản phẩm');
    }
  };

  if (loading) {
    return <div className="p-6 text-text-muted">Đang tải...</div>;
  }

  return (
    <div className="p-6 max-w-3750px mx-16 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/artisans')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-card border border-border-subtle text-text-muted hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-text-ink">
          {!id ? 'Thêm mới nghệ danh' : isEditing ? 'Chỉnh sửa nghệ danh' : 'Chi tiết nghệ danh'}
        </h1>
        <div className="ml-auto flex items-center gap-3">
          {isEditing ? (
            <>
              {id && (
                <button
                  onClick={() => { setIsEditing(false); loadArtisan(); }}
                  disabled={saving}
                  className="bg-surface-container text-text-ink px-6 py-2 rounded-lg font-semibold hover:bg-border-medium transition-colors border border-border-subtle"
                >
                  Hủy
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined">save</span>
                {saving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined">edit</span>
              Sửa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Information */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-sm">
            <h2 className="text-lg font-bold text-text-ink mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span>
              Thông tin cơ bản
            </h2>

            <div className="flex flex-col items-center mb-6">
              <div 
                className={`w-24 h-24 rounded-full bg-surface-container border-2 border-border-medium overflow-hidden mb-3 relative group ${isEditing ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className={`w-full h-full object-cover transition-opacity ${isUploadingAvatar ? 'opacity-50' : ''}`} />
                ) : (
                  <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-text-muted text-4xl">person</span>
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isUploadingAvatar ? (
                       <span className="material-symbols-outlined text-white animate-spin">progress_activity</span>
                    ) : (
                       <span className="material-symbols-outlined text-white">photo_camera</span>
                    )}
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-ink mb-1.5">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="Nhập họ và tên"
                  className={`w-full focus:outline-none text-text-ink transition-colors ${isEditing
                    ? 'px-4 py-2.5 rounded-lg border border-border-medium bg-surface-container focus:border-primary'
                    : 'bg-transparent border-transparent px-0 font-medium'
                    }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-ink mb-1.5">Ngày sinh</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full focus:outline-none text-text-ink transition-colors ${isEditing
                    ? 'px-4 py-2.5 rounded-lg border border-border-medium bg-surface-container focus:border-primary'
                    : 'bg-transparent border-transparent px-0 font-medium'
                    }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        {isEditMode && (
          <div className="lg:col-span-2">
            <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                <h2 className="text-lg font-bold text-text-ink flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  Sản phẩm của nghệ danh ({artisanInfo?.products?.length || 0})
                </h2>
                {isEditing && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-primary font-semibold flex items-center gap-1 hover:bg-primary-container px-3 py-1.5 rounded-lg transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_link</span>
                    Gán sản phẩm
                  </button>
                )}
              </div>

              <div className="flex-1 p-0 overflow-x-auto">
                <table className="w-full text-left min-w-125">
                  <thead className="bg-surface-container border-b border-border-subtle">
                    <tr>
                      <th className="p-4 text-sm font-semibold text-text-muted">Sản phẩm</th>
                      {isEditing && (
                        <th className="p-4 text-sm font-semibold text-text-muted w-32 text-right">Thao tác</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {artisanInfo?.products && artisanInfo.products.length > 0 ? (
                      artisanInfo.products.map((product: any) => (
                        <tr key={product.id} className="hover:bg-surface-container/50">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <Link to={`/product/${product.id}`} target="_blank" className="flex items-center gap-4 group cursor-pointer w-fit">
                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-border-subtle group-hover:opacity-80 transition-opacity" />
                                <span className="font-semibold text-text-ink line-clamp-1 group-hover:text-primary transition-colors">{product.name}</span>
                              </Link>
                            </div>
                          </td>
                          {isEditing && (
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleRemoveProduct(product.id)}
                                className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors ml-auto"
                                title="Gỡ khỏi nghệ danh"
                              >
                                <span className="material-symbols-outlined text-[18px]">link_off</span>
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-10 text-center text-text-muted">
                          Nghệ danh này chưa có sản phẩm nào.<br />Nhấn "Gán sản phẩm" để thêm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select Product Modal */}
      <SelectProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProducts}
        existingProductIds={artisanInfo?.products?.map((p: any) => p.id) || []}
        currentArtisanId={id}
      />
    </div>
  );
};
