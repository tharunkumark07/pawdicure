/**
 * Utility to process, scale and compress user-uploaded pet images.
 * Keeps avatars crisp, lightweight (<100KB) and safe for Firestore / localStorage persistence.
 */

export function processImageFile(file: File, maxSize = 600, quality = 0.86): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio preserving bounds
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback to original read if canvas context fails
          resolve(event.target?.result as string);
          return;
        }

        // Draw and export compressed JPEG / WebP
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for processing.'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.readAsDataURL(file);
  });
}

export const PRESET_PET_AVATARS = [
  {
    name: 'Golden Retriever',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80',
    species: 'Dog',
  },
  {
    name: 'French Bulldog',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80',
    species: 'Dog',
  },
  {
    name: 'German Shepherd',
    url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=500&q=80',
    species: 'Dog',
  },
  {
    name: 'Labrador Retriever',
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80',
    species: 'Dog',
  },
  {
    name: 'Siberian Husky',
    url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=500&q=80',
    species: 'Dog',
  },
  {
    name: 'Pembroke Corgi',
    url: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=500&q=80',
    species: 'Dog',
  },
  {
    name: 'Tabby Shorthair Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80',
    species: 'Cat',
  },
  {
    name: 'British Shorthair Cat',
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80',
    species: 'Cat',
  },
  {
    name: 'Fluffy Ragdoll Cat',
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=500&q=80',
    species: 'Cat',
  },
  {
    name: 'Holland Lop Bunny',
    url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=500&q=80',
    species: 'Other',
  },
];
