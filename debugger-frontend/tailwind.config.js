const { color } = require("framer-motion")

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'],
      },
      screens: {
        'smd': '640px', // Custom breakpoint for 640px and above
      },
      colors: {
        mybg: "#f0f9f8", // Adding your custom color
        //mytitlebar: "#81bfb7",
        mytitlebar: "#10375b",
        //mytext: "#1c1c1c",
        mytext: "#D3D2D2",
        mytextbg: "#015c60",
        'emerald': {
          400: '#34d399',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        'gray': {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}
