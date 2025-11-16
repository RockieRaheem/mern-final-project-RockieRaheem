# File Upload & Download Fixes

## Issues Fixed

### 1. **Download URL Problems**

- ❌ **Before**: `http://localhost:5001/api/api/downloads/undefined?originalName=undefined`
- ✅ **After**: `http://localhost:5001/api/downloads/attachments-123456.pdf?originalName=sample.pdf`

**Problems Identified:**

- Double `/api/api/` in URL (VITE_API_URL already includes `/api`)
- `undefined` for filename (wasn't extracting from attachment object properly)
- `undefined` for originalName (wasn't falling back correctly)

**Solutions Applied:**

- Changed download URL from `/api/downloads/` to `/downloads/` (since base URL already has `/api`)
- Extract filename from `attachment.filename` or parse from `attachment.url`
- Fallback to filename if originalName is missing
- Use consistent `originalName` and `filename` variables throughout

### 2. **File Display Issues**

- ❌ **Before**: Generic attachment div with no preview
- ✅ **After**: File-specific rendering:
  - **PDFs**: Full inline viewer with 600px iframe
  - **Images**: Inline display with hover download button
  - **Videos**: HTML5 video player with controls
  - **Documents**: Icon, filename, size, and action buttons

### 3. **Attachment Data Structure**

The backend correctly saves:

```javascript
{
  filename: "attachments-1234567890.pdf",  // Server-generated filename
  originalName: "My Document.pdf",          // User's original filename
  url: "/uploads/attachments-1234567890.pdf",
  fileType: "pdf",                          // Detected type
  mimeType: "application/pdf",
  size: 245760                              // In bytes
}
```

## Changes Made

### Backend Files

#### 1. `/backend/server.js`

- Enhanced upload middleware with proper Content-Type headers
- Added inline Content-Disposition (allows viewing in browser)
- Mapped file extensions to MIME types

#### 2. `/backend/routes/downloads.js` (NEW)

- Created dedicated download endpoint
- Forces download with `Content-Disposition: attachment`
- Uses original filename for downloads
- Handles file streaming efficiently
- Returns 404 if file doesn't exist

### Frontend Files

#### 1. `/frontend/src/pages/AnswerDetail.jsx`

**renderAttachment() function:**

- Extract filename from URL if not in attachment object
- Fixed download URL (removed `/api` prefix)
- Separate rendering for each file type:
  - **PDF**: 600px iframe viewer + download button below
  - **Image**: Full-width display with hover overlay
  - **Video**: HTML5 player with controls
  - **Document**: Icon + metadata + Open/Download buttons
  - **Other**: Generic attachment with download button

#### 2. `/frontend/src/pages/QuestionDetail.jsx`

- Applied same fixes as AnswerDetail.jsx
- Consistent file rendering across both pages
- Added stopPropagation to prevent navigation on file actions

## File Type Rendering Details

### PDF Files

```jsx
<div className="w-full" style={{ height: "600px" }}>
  <iframe src={fileUrl} className="w-full h-full border-0" />
</div>
```

- Displays PDF inline in 600px iframe
- Download button below with filename
- Shows file size
- Red PDF icon indicator

### Image Files

```jsx
<img src={fileUrl} className="w-full max-h-96 object-contain" />
```

- Inline display with max height
- Hover overlay shows filename
- Download button appears on hover
- Properly scaled and contained

### Video Files

```jsx
<video controls className="w-full max-h-96" preload="metadata">
  <source src={fileUrl} type={mimeType} />
</video>
```

- HTML5 video player with controls
- Proper MIME type for codec support
- Filename and download button below
- Dark background for video player

### Document Files

```jsx
<div className="flex items-start gap-4">
  <div className="icon">📄</div>
  <div className="details">
    <h4>{originalName}</h4>
    <p>{fileSize} KB</p>
    <p>{mimeType}</p>
    <button>Open</button>
    <button>Download</button>
  </div>
</div>
```

- Blue document icon
- Shows filename, size, and MIME type
- "Open" button (new tab)
- "Download" button (forces download)

## Download Endpoint

### Route: `GET /api/downloads/:filename`

**Query Parameters:**

- `originalName`: The original filename for download

**Example:**

```
GET /api/downloads/attachments-1234567890.pdf?originalName=My%20Document.pdf
```

**Response Headers:**

- `Content-Type`: Proper MIME type
- `Content-Length`: File size
- `Content-Disposition`: `attachment; filename="My Document.pdf"`

**Features:**

- Streams file efficiently (no memory buffering)
- Returns 404 if file doesn't exist
- Uses original filename for download
- Proper content types for all formats

## Testing Checklist

### File Upload

- [x] Upload PDF - Check it's saved with correct metadata
- [x] Upload image - Verify fileType is "image"
- [x] Upload video - Verify fileType is "video"
- [x] Upload document (.docx) - Verify fileType is "document"
- [x] Check database has filename and originalName fields

### File Display

- [x] PDF displays in iframe (600px height)
- [x] Image displays inline with proper scaling
- [x] Video plays with controls
- [x] Document shows icon and metadata
- [x] All filenames display correctly

### File Download

- [x] Click download on PDF - Downloads as .pdf
- [x] Click download on image - Downloads with original extension
- [x] Click download on video - Downloads as video file
- [x] Click download on document - Downloads with correct extension
- [x] Downloaded file has original filename
- [x] Downloaded file opens correctly

## Environment Variables

Make sure your `.env` files have:

**Backend** (`/backend/.env`):

```env
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

**Frontend** (`/frontend/.env`):

```env
VITE_API_URL=http://localhost:5001/api
```

⚠️ **Important**: `VITE_API_URL` should include `/api` but NOT end with a slash

## Common Issues & Solutions

### Issue: "Route not found" on download

**Cause**: Download route not registered in server.js
**Solution**: Ensure `app.use("/api/downloads", downloadRoutes)` is in server.js

### Issue: File downloads as .html

**Cause**: Incorrect Content-Type or Content-Disposition headers
**Solution**: Use dedicated download endpoint with proper headers

### Issue: undefined filename

**Cause**: Attachment object missing filename field
**Solution**: Extract from URL: `attachment.url?.split('/').pop()`

### Issue: Double /api/api/ in URL

**Cause**: Adding `/api` to URL when base already has it
**Solution**: Use `/downloads/` instead of `/api/downloads/`

### Issue: PDF not displaying inline

**Cause**: Missing iframe or incorrect src
**Solution**: Use `<iframe src={fileUrl} />` with proper height

## File Upload Limits

Current configuration:

- **Max file size**: 5 MB per file
- **Max files per answer**: 5 files
- **Max files per question**: 3 files
- **Allowed types**: Images, videos, PDFs, documents

To change limits, edit:

- `/backend/utils/fileUpload.js` - File size and types
- `/backend/routes/answers.js` - Number of files per upload

## Supported File Types

| Type      | Extensions                     | MIME Types                     | Display Method |
| --------- | ------------------------------ | ------------------------------ | -------------- |
| Images    | .jpg, .jpeg, .png, .gif, .webp | image/\*                       | Inline image   |
| Videos    | .mp4, .webm, .ogg              | video/\*                       | HTML5 player   |
| PDFs      | .pdf                           | application/pdf                | iframe viewer  |
| Documents | .doc, .docx, .txt              | application/msword, text/plain | Icon + buttons |

## Architecture

```
User uploads file
    ↓
Multer saves to /uploads folder
    ↓
Controller detects file type
    ↓
Saves metadata to database
    ↓
Frontend receives attachment object
    ↓
Renders based on fileType
    ↓
View: Direct URL to /uploads
Download: /api/downloads endpoint
```

## Summary

All file upload, display, and download issues have been resolved:

- ✅ Files display correctly based on type
- ✅ PDFs show in inline viewer
- ✅ Downloads work with correct filenames
- ✅ No more "undefined" in URLs
- ✅ No more .html downloads
- ✅ Proper MIME types and headers
- ✅ Clean, professional UI for all file types
