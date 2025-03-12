require('dotenv').config();
const fs = require('fs');

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/js");

  // Generate config file
  eleventyConfig.on('beforeBuild', () => {
    // Create _site/js directory if it doesn't exist
    if (!fs.existsSync('_site/js')) {
      fs.mkdirSync('_site/js', { recursive: true });
    }

    // Write the config file with no template literals
    const config = `window.SUPABASE_CONFIG = {
      url: 'https://${process.env.SUPABASE_URL}',
      key: '${process.env.SUPABASE_ANON_KEY}'
    };`;

    // Write config file directly to _site/js
    fs.writeFileSync('_site/js/config.js', config);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
}; 