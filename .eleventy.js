require('dotenv').config();
const fs = require('fs');

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/js");

  // Generate config file
  eleventyConfig.on('beforeBuild', () => {
    console.log('Building with environment variables:', {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_ANON_KEY,
      urlPreview: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 10) : 'missing'
    });

    const configTemplate = fs.readFileSync('src/js/config.js', 'utf8');
    const config = configTemplate
      .replace('{{ SUPABASE_URL }}', process.env.SUPABASE_URL || '')
      .replace('{{ SUPABASE_ANON_KEY }}', process.env.SUPABASE_ANON_KEY || '');
    
    // Ensure _site/js directory exists
    if (!fs.existsSync('_site/js')) {
      fs.mkdirSync('_site/js', { recursive: true });
    }
    
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