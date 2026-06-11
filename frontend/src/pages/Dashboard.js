import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import useDesignStore from '../store/designStore';

const Dashboard = () => {
  const { user, token } = useAuthStore();
  const { designs, getDesigns, deleteDesign, loading } = useDesignStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getDesigns(token);
    }
  }, [token, getDesigns]);

  const handleCreateDesign = async () => {
    try {
      const name = prompt('Enter design name:');
      if (name) {
        const newDesign = await useDesignStore.getState().createDesign(
          name,
          '',
          { objects: [] },
          'general',
          token
        );
        toast.success('Design created!');
        navigate(`/editor/${newDesign.id}`);
      }
    } catch (error) {
      toast.error('Failed to create design');
    }
  };

  const handleDeleteDesign = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteDesign(id, token);
        toast.success('Design deleted!');
      } catch (error) {
        toast.error('Failed to delete design');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Designs</h1>
          <button
            onClick={handleCreateDesign}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <FiPlus /> New Design
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No designs yet. Create your first design!</p>
            <button
              onClick={handleCreateDesign}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div key={design.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {design.thumbnail ? (
                    <img src={design.thumbnail} alt={design.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No preview</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{design.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{design.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/editor/${design.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDesign(design.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
