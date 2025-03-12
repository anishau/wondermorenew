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
      keyLength: process.env.SUPABASE_ANON_KEY?.length || 0
    });

    // Ensure URL is properly formatted
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is not defined');
    }

    const config = `window.SUPABASE_CONFIG = {
      url: '${supabaseUrl}',
      key: '${process.env.SUPABASE_ANON_KEY}'
    };
    console.log('Supabase config loaded:', {
      url: window.SUPABASE_CONFIG.url,
      keyLength: window.SUPABASE_CONFIG.key?.length
    });`;

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