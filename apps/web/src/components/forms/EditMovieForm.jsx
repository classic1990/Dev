import React, { useState, useEffect } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const EditMovieForm = ({ open, onClose, movie, onSuccess }) => {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    posterUrl: '',
    youtubeUrl: '',
    videoId: '',
    duration: '',
    rating: '',
    year: ''
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        category: movie.category || '',
        posterUrl: movie.posterUrl || '',
        youtubeUrl: movie.youtubeUrl || '',
        videoId: movie.videoId || '',
        duration: movie.duration || '',
        rating: movie.rating || '',
        year: movie.year || ''
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const data = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        year: formData.year ? parseFloat(formData.year) : null
      };

      const response = await apiServerClient.fetch(`/movies/${movie.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update movie');
      
      toast({
        title: 'สำเร็จ',
        description: 'แก้ไขหนังสำเร็จ',
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: error.message || 'เกิดข้อผิดพลาดในการแก้ไขหนัง',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">แก้ไขหนัง</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-700">ชื่อหนัง *</Label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-700">รายละเอียด</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-gray-700">หมวดหมู่</Label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            <div>
              <Label htmlFor="duration" className="text-gray-700">ความยาว (นาที)</Label>
              <input
                id="duration"
                name="duration"
                type="text"
                placeholder="เช่น 120"
                value={formData.duration}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="posterUrl" className="text-gray-700">ลิงค์รูปโปสเตอร์</Label>
            <input
              id="posterUrl"
              name="posterUrl"
              type="url"
              value={formData.posterUrl}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>

          <div>
            <Label htmlFor="youtubeUrl" className="text-gray-700">ลิงค์ YouTube</Label>
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              value={formData.youtubeUrl}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>

          <div>
            <Label htmlFor="videoId" className="text-gray-700">ID วิดีโอ</Label>
            <input
              id="videoId"
              name="videoId"
              type="text"
              value={formData.videoId}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating" className="text-gray-700">คะแนน (0-10)</Label>
              <input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            <div>
              <Label htmlFor="year" className="text-gray-700">ปี</Label>
              <input
                id="year"
                name="year"
                type="number"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMovieForm;