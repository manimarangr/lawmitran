module.exports = {
  corePlugins: {
    preflight: false,
  },

  content: ['./src/**/*.{html,ts}'],

  theme: {
    extend: {
      colors: {
        navy: '#0b1f3a',
        gold: '#c59d35',
        ink: '#18212f',
        mist: '#f5f7fb',
        teal: '#0f766e'
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif']
      }
    }
  },

  plugins: []
};