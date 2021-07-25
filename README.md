# Getit

That's a dummy e-commerce.

### Here you can

- Create an account
- Change your password
- Search for products
- Fill your cart with stuff

### Limitations

- Missing categories, home and profile page
- Products have no image and no description
- The search algorithm is oversimplified
- You can't actually buy stuff

### Features

- Responsive, mobile first design
- Fully accessible
  - Semantic markup
  - Aria labelled
  - Focus trap and reset when opening dialogs
- Plenty of feedbacks for the user
  - Inputs give suggestions and visual clues of validation
  - The user may receive informative notifications
  - Error messages are delivered to the UI
- SEO ready
- 100/100 Web Vitals performance

### Dependencies

- React.js
- Next.js
- NextAuth.js
- Redux
- Redux Toolkit
- MongoDB
- bcrypt.js

### Acknowledgment

- **Kaggle** for the [dummy database of products](https://www.kaggle.com/carrie1/ecommerce-data)
- **Unsplash** & **Dane Deaner** for [this image](https://unsplash.com/photos/j5asemKMmQY) used as placeholder in every product
- [**Heroicons**](https://heroicons.com/) for all the svg icons
- [**SVG Backgrounds**](https://www.svgbackgrounds.com/) for the background image
- [**Vercel**](https://vercel.com/) for deploying

# [Visit Getit --> getit.vercel.app](https://getit.vercel.app/)

### Additional info

Users can **authenticate** themselves only with email and password.
The email doesn't have to exist, and there is no way to recover a forgotten password.

**Passwords** are hashed before being stored.
And requests to retrieve an user's cart are possible only while they are logged in.

When logging in, the guest **cart** is sent to our database of users and becomes the user's personal cart.
If the user already had a personal cart they are promped to choose whether they want to merge the two carts or save one of them.

The database of products contains lots of items that will end up being identical (except for the ID) on the website.
It may be confusing for someone navigating throughout the site. But that's not a problem a real e-commerce would face.

Thanks to **Next.js** pages are either statically generated at buld time or prerendered on server side.
This allows search engines to properly crawl and index the site.
Next.js also comes with built in image optimization and lazy loading.

This web app takes advantage of MongoDB **connection pooling** to get quick access to the database and fast server responses.
