import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import useDesignStore from '../store/designStore';

const Editor = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentDesign, getDesign, updateDesign } = useDesignStore();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token && id) {
      getDesign(id, token);
    }
  }, [token, id, getDesign]);

  useEffect(() => {
    if (currentDesign) {
      setName(currentDesign.name);
    }
  }, [currentDesign]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDesign(id, { name }, token);
      toast.success('Design saved!');
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-3xl font-bold text-gray-900 border-b-2 border-blue-600 focus:outline-none"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Canvas Editor Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
