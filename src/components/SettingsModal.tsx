import React, { useState, useEffect } from 'react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  initialSettings: Settings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleChange = (key: keyof Settings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {/* R2 Configuration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              R2 Account ID
            </label>
            <input
              type="text"
              value={settings.r2AccountId}
              onChange={(e) => handleChange('r2AccountId', e.target.value)}
              placeholder="Your R2 Account ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              R2 Access Key ID
            </label>
            <input
              type="text"
              value={settings.r2AccessKeyId}
              onChange={(e) => handleChange('r2AccessKeyId', e.target.value)}
              placeholder="Your R2 Access Key ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              R2 Secret Access Key
            </label>
            <input
              type="password"
              value={settings.r2SecretAccessKey}
              onChange={(e) => handleChange('r2SecretAccessKey', e.target.value)}
              placeholder="Your R2 Secret Access Key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              R2 Bucket Name
            </label>
            <input
              type="text"
              value={settings.r2BucketName}
              onChange={(e) => handleChange('r2BucketName', e.target.value)}
              placeholder="Your R2 Bucket Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              R2 Endpoint
            </label>
            <input
              type="text"
              value={settings.r2Endpoint}
              onChange={(e) => handleChange('r2Endpoint', e.target.value)}
              placeholder="Your R2 Endpoint"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
