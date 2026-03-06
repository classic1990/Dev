import React, { useState } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AddMovieForm = ({ open, onClose, onSuccess }) => {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    posterUrl: '',
    youtubeUrl: '',
    videoId: '',
    duration: '',
    rating: '',
    year: '',
    uploader: '' // Added to store uploader temporarily even if not in DB schema
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFetchYouTube = async () => {
    if (!formData.youtubeUrl) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'กรุณากรอกลิงค์ YouTube ก่อนดึงข้อมูล',
        variant: 'destructive'
      });
      return;
    }

    setFetchingYoutube(true);
    try {
      const response = await apiServerClient.fetch('/movies/fetch-youtube-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: formData.youtubeUrl })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก YouTube');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        posterUrl: data.posterUrl || prev.posterUrl,
        duration: data.duration ? Math.ceil(data.duration / 60).toString() : prev.duration,
        videoId: data.videoId || prev.videoId,
        uploader: data.uploader || prev.uploader
      }));

      toast({
        title: 'สำเร็จ',
        description: 'ดึงข้อมูลจาก YouTube สำเร็จ',
      });
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
        action: (
          <Button variant="outline" size="sm" onClick={handleFetchYouTube}>
            ลองใหม่
          </Button>
        )
      });
    } finally {
      setFetchingYoutube(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const data = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        posterUrl: formData.posterUrl,
        youtubeUrl: formData.youtubeUrl,
        videoId: formData.videoId,
        duration: formData.duration,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        year: formData.year ? parseFloat(formData.year) : null
      };

      const response = await apiServerClient.fetch('/movies', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to create movie');
      
      toast({
        title: 'สำเร็จ',
        description: 'เพิ่มหนังสำเร็จ',
      });

      setFormData({
        title: '',
        description: '',
        category: '',
        posterUrl: '',
        youtubeUrl: '',
        videoId: '',
        duration: '',
        rating: '',
        year: '',
        uploader: ''
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: error.message || 'เกิดข้อผิดพลาดในการเพิ่มหนัง',
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
          <DialogTitle className="text-2xl font-bold">เพิ่มหนังใหม่</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="youtubeUrl" className="text-gray-700">ลิงค์ YouTube</Label>
            <div className="flex gap-2 mt-1">
              <input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
              <Button 
                type="button" 
                onClick={handleFetchYouTube} 
                disabled={fetchingYoutube || !formData.youtubeUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                {fetchingYoutube ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังดึงข้อมูล...
                  </>
                ) : 'ดึงข้อมูลจาก YouTube'}
              </Button>
            </div>
          </div>

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

export default AddMovieForm;