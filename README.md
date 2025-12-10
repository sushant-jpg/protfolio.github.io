# Portfolio Website

A modern, responsive portfolio website with a dark theme and purple/blue gradient accents. Perfect for showcasing your projects, skills, and connecting with potential employers on LinkedIn.

## Features

- 🎨 Modern dark theme with gradient accents
- 📱 Fully responsive design
- 🚀 Smooth scrolling navigation
- 💼 Portfolio showcase with live demo links
- 📜 Certificates section
- 🛠️ Tech stack display
- 📧 Contact form
- 🔗 LinkedIn integration ready

## Getting Started

### 1. Customize Your Information

Open `index.html` and update the following:

- **Name**: Replace "Your Name" with your actual name
- **Title**: Update "Full Stack Developer" to match your role
- **Bio**: Update the about section with your information
- **Profile Image**: Replace the placeholder image URL with your photo
- **Projects**: Edit the `projects` array in `script.js` with your actual projects
- **Certificates**: Update the `certificates` array in `script.js`
- **Tech Stack**: Modify the `techStack` array in `script.js`
- **Social Links**: Update LinkedIn, GitHub, and email links in the contact section

### 2. Add Your Projects

In `script.js`, update the `projects` array:

```javascript
const projects = [
    {
        title: "Your Project Name",
        description: "Project description",
        logo: "🎨", // or use an emoji/icon
        liveDemo: "https://your-live-demo-url.com",
        github: "https://github.com/yourusername/project"
    },
    // Add more projects...
];
```

### 3. Add Your Profile Image

Replace the placeholder image in `index.html`:

```html
<img src="path/to/your/photo.jpg" alt="Your Name" id="profileImage">
```

Or use an online image URL.

### 4. Update Social Links

In `index.html`, find the social links section and update:

```html
<a href="https://linkedin.com/in/yourprofile" target="_blank" class="social-link">
<a href="https://github.com/yourusername" target="_blank" class="social-link">
<a href="mailto:your.email@example.com" class="social-link">
```

### 5. Add Your CV

1. Place your CV file in the project folder
2. Update the CV path in `script.js`:

```javascript
const cvUrl = 'path/to/your/cv.pdf';
```

## Deployment

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Push your files to the repository
3. Go to Settings > Pages
4. Select your main branch
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free)

1. Sign up at [Netlify](https://www.netlify.com)
2. Drag and drop your project folder
3. Your site will be live instantly

### Option 3: Vercel (Free)

1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click

## Linking to LinkedIn

1. Deploy your portfolio website
2. Go to your LinkedIn profile
3. Click "Edit" on your profile
4. Add your portfolio URL to:
   - **Contact info** section
   - **Featured** section (to showcase projects)
   - **About** section (mention your portfolio)

## Customization

### Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-purple: #8b5cf6;
    --secondary-purple: #a78bfa;
    --accent-blue: #3b82f6;
    /* ... */
}
```

### Fonts

Change the font family in `styles.css`:

```css
body {
    font-family: 'Your Font', sans-serif;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Feel free to use this template for your personal portfolio!

## Support

If you have any questions or need help customizing your portfolio, feel free to reach out!

---

**Made with ❤️ for showcasing your amazing work!**

