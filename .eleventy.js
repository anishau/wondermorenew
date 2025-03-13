require('dotenv').config();
const fs = require('fs');

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/js");

  // Generate config file
  eleventyConfig.on('beforeBuild', () => {
    if (!fs.existsSync('_site/js')) {
      fs.mkdirSync('_site/js', { recursive: true });
    }

    // Log the environment variables (for debugging)
    console.log('Environment variables:', {
      url: process.env.SUPABASE_URL,
      siteUrl: process.env.SITE_URL || 'http://localhost:8080',
      keyLength: process.env.SUPABASE_ANON_KEY?.length || 0
    });

    // Ensure URL is properly formatted
    const supabaseUrl = process.env.SUPABASE_URL;
    const siteUrl = process.env.SITE_URL || 'http://localhost:8080';
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is not defined');
    }

    const config = `window.SUPABASE_CONFIG = {
      url: '${supabaseUrl}',
      key: '${process.env.SUPABASE_ANON_KEY}',
      siteUrl: '${siteUrl}'
    };`;

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