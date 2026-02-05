import { useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Upload, X } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

export default function PaymentQrUploader() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const url = blob.getDirectURL();
      setQrImage(url);
      toast.success('QR code uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload QR code');
      console.error(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    setQrImage(null);
  };

  return (
    <div className="space-y-2">
      <Label>Payment QR Code (Optional)</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4">
        {qrImage ? (
          <div className="relative">
            <img
              src={qrImage}
              alt="Payment QR Code"
              className="w-full max-w-xs mx-auto rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <img
              src="/assets/generated/qr-placeholder-frame.dim_800x800.png"
              alt="QR Placeholder"
              className="w-48 h-48 mx-auto opacity-50"
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload your payment QR code for easier payments
              </p>
              <label htmlFor="qr-upload">
                <Button variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? `Uploading ${uploadProgress}%` : 'Upload QR Code'}
                  </span>
                </Button>
              </label>
              <input
                id="qr-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
