# Quick Customization Guide

## Step-by-Step Customization

### 1. Personal Information (5 minutes)

**In `index.html`, find and replace:**

- Line 7: `<title>Portfolio - Your Name</title>` → Your name
- Line 18: `<div class="logo">Your Name</div>` → Your name
- Line 30: `Full Stack <span class="gradient-text">Developer</span>` → Your title
- Line 33: `Computer Engineering Student |` → Your subtitle
- Line 36: Description text → Your description
- Line 95: `<h2 class="name">Your Name</h2>` → Your name
- Line 97-99: Bio text → Your bio

### 2. Profile Image (2 minutes)

**In `index.html`, line 108:**

Replace:
```html
<img src="https://via.placeholder.com/400x400?text=Your+Photo" alt="Your Name" id="profileImage">
```

With:
```html
<img src="images/your-photo.jpg" alt="Your Name" id="profileImage">
```

Or use an online URL if your image is hosted elsewhere.

### 3. Projects (10 minutes)

**In `script.js`, lines 89-103:**

Replace the `projects` array with your actual projects:

```javascript
const projects = [
    {
        title: "My Awesome Project",
        description: "A brief description of what this project does",
        logo: "🚀", // Use emoji or icon
        liveDemo: "https://myproject-demo.netlify.app",
        github: "https://github.com/yourusername/myproject"
    },
    {
        title: "Another Project",
        description: "Another project description",
        logo: "💻",
        liveDemo: "https://another-project.com",
        github: "https://github.com/yourusername/another"
    }
    // Add as many as you want!
];
```

### 4. Certificates (5 minutes)

**In `script.js`, lines 106-110:**

```javascript
const certificates = [
    { name: "Full Stack Web Development", issuer: "Coursera" },
    { name: "React Developer Certification", issuer: "FreeCodeCamp" },
    { name: "AWS Certified", issuer: "Amazon" }
    // Add your certificates
];
```

### 5. Tech Stack (3 minutes)

**In `script.js`, lines 113-120:**

```javascript
const techStack = [
    { name: "Python", icon: "🐍" },
    { name: "JavaScript", icon: "📜" },
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "MongoDB", icon: "🍃" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Docker", icon: "🐳" }
    // Add your technologies
];
```

### 6. Social Links (3 minutes)

**In `index.html`, lines 250-262:**

Replace:
- `https://linkedin.com/in/yourprofile` → Your LinkedIn URL
- `https://github.com/yourusername` → Your GitHub URL
- `your.email@example.com` → Your email

### 7. Statistics (2 minutes)

**In `index.html`, lines 120-135:**

Update the `data-target` values:
- Projects: Change `data-target="10"` to your actual number
- Certificates: Change `data-target="5"` to your actual number
- Technologies: Change `data-target="4"` to your actual number

### 8. CV Download (2 minutes)

**In `script.js`, line 178:**

Replace:
```javascript
const cvUrl = 'path/to/your/cv.pdf';
```

With the actual path to your CV file.

### 9. Tech Buttons (2 minutes)

**In `index.html`, lines 40-45:**

Update the tech buttons to match your skills:
```html
<button class="tech-btn">Python</button>
<button class="tech-btn">Javascript</button>
<button class="tech-btn">Node.js</button>
<button class="tech-btn">React</button>
```

## Color Customization

**In `styles.css`, lines 6-16:**

You can change the color scheme by modifying these variables:

```css
:root {
    --primary-purple: #8b5cf6;  /* Main purple color */
    --secondary-purple: #a78bfa; /* Lighter purple */
    --accent-blue: #3b82f6;      /* Blue accent */
    /* ... */
}
```

## Testing Your Changes

1. Open `index.html` in your browser
2. Test all navigation links
3. Check that projects display correctly
4. Verify contact form works
5. Test on mobile (resize browser window)

## Deployment Checklist

- [ ] All personal information updated
- [ ] Profile image added
- [ ] Projects with live demo links added
- [ ] Certificates added
- [ ] Tech stack updated
- [ ] Social links updated
- [ ] Statistics updated
- [ ] CV file added and path updated
- [ ] Tested on desktop and mobile
- [ ] Deployed to hosting service
- [ ] LinkedIn profile updated with portfolio link

## Need Help?

- Check the main `README.md` for deployment instructions
- All code is well-commented for easy understanding
- Feel free to modify any part to match your style!

