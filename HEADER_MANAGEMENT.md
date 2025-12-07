# Header & Navigation Management

This admin panel provides complete control over the website header and navigation system.

## Features

### 1. Branding
- **Logo Upload**: Upload and preview your company logo (PNG with transparent background recommended)
- **Brand Name**: Configure the brand name in two parts (e.g., "Nex" and "Real Estate")
- **Real-time Preview**: See how your branding changes will look before saving

### 2. Top Bar
- **Toggle Visibility**: Show/hide the top bar with contact information
- **Contact Information**:
  - Phone number
  - Email address
- **Social Media Links**:
  - Facebook
  - YouTube
  - LinkedIn

### 3. Navigation Menu
- **Add/Remove Items**: Create unlimited navigation menu items
- **Reorder Items**: Use up/down arrows to change menu order
- **Submenu Support**: Add dropdown submenus to any navigation item
- **Dynamic Management**: Each item and submenu is fully customizable

### 4. CTA Button
- **Button Text**: Customize the call-to-action button text
- **Button Link**: Set the destination URL
- **Preview**: See real-time preview of your CTA button

## How to Use

1. Navigate to **Admin > Header & Navigation** from the sidebar
2. Use the tabs to switch between different sections:
   - **Branding**: Logo and brand name settings
   - **Top Bar**: Contact info and social links
   - **Navigation**: Menu items and structure
   - **CTA**: Call-to-action button configuration
3. Make your changes in each section
4. Click **Save Changes** to apply your updates
5. Changes will be immediately reflected on the frontend

## Image Upload

When uploading a logo:
- Supported formats: PNG, JPG, SVG
- Recommended: PNG with transparent background
- The image preview shows before upload
- Image is stored as base64 (for demo purposes)

## Navigation Structure

Navigation items are stored with:
- **ID**: Unique identifier
- **Name**: Display text
- **Link**: URL/route
- **Order**: Display position (lower numbers appear first)
- **Children**: Optional submenu items

## Technical Details

- **Form Validation**: All fields are validated using Zod schemas
- **State Management**: Uses Zustand for global state
- **Form Handling**: React Hook Form for efficient form management
- **UI Components**: Built with shadcn/ui for consistent design
- **Data Persistence**: Changes are persisted in browser storage (Zustand persist middleware)

## Default Values

The header comes pre-configured with the current website settings:
- Logo: `/logo.png`
- Brand: "Nex Real Estate"
- Phone: +880 1677-600000
- Email: hello.nexrealestate@gmail.com
- Full navigation menu with all current items

All default values can be modified through the admin interface.
