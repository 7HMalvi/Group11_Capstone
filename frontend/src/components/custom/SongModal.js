import React from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import CreatableSelect from './CreatableSelect';
import { GetAlbums, GetArtists, GetGenres } from '../../services/APIRoutes';

export default function SongModal({ isOpen, setIsOpen, formData, setFormData, errors, setErrors, handleSubmit, handleTitle, handleFileChange }) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded p-6 shadow-red text-white bg-black">
          <div className="flex justify-between items-center">
            <Dialog.Title className="text-lg font-medium text-red-500">Add Song</Dialog.Title>
            <button onClick={() => setIsOpen(false)}>
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-white">
              <div>
                <label className="block text-sm font-medium">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  placeholder='Enter Title'
                  value={formData.title}
                  onChange={handleTitle}
                  className="mt-1 block w-full shadow-sm text-sm border-0 border-b-2 border-red-600 p-2 bg-black focus:border-2 focus:border-red-500 focus:outline-none"
                  required
                />
                {errors.title && (<small className="text-sm text-red-500">{errors.title}</small>)}
              </div>

              <div>
                <label className="block text-sm font-medium">Artists <span className="text-red-500">*</span></label>
                <CreatableSelect
                    url={GetArtists}onChange={value => setFormData({ ...formData, artists: value })}value={formData.artists}/>
              </div>

              <div>
                <label className="block text-sm font-medium">Albums <span className="text-red-500">*</span></label>
                <CreatableSelect
                    url={GetAlbums} onChange={value => setFormData({ ...formData, albums: value })}value={formData.albums}/>
              </div>

              <div>
                <label className="block text-sm font-medium">Genres <span className="text-red-500">*</span></label>
                <CreatableSelect
                    url={GetGenres} onChange={value => setFormData({ ...formData, genres: value })}value={formData.genres}/>
              </div>

              <div>
                <label className="block text-sm font-medium">Audio File <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  name="song"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Cover Image </label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </div>

              {errors.select && (<small className="text-sm text-red-500">{errors.select}</small>)}
              <div className="flex justify-end">
                <button
                  type="button" className="border border-red-600 px-4 py-2 mr-2" onClick={() => setIsOpen(false)}>Cancel</button>

                <button
                  type="submit" className="border border-red-600 bg-red-600 text-white px-4 py-2">Add</button>
              </div>
            </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}