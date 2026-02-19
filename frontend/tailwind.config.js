/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // M3 Color System
            colors: {
                md: {
                    // Primary
                    primary: '#1A73E8',
                    'on-primary': '#FFFFFF',
                    'primary-container': '#D3E3FD',
                    'on-primary-container': '#041E49',

                    // Secondary  
                    secondary: '#5F6368',
                    'on-secondary': '#FFFFFF',
                    'secondary-container': '#E8EAED',
                    'on-secondary-container': '#1F1F1F',

                    // Tertiary
                    tertiary: '#188038',
                    'on-tertiary': '#FFFFFF',
                    'tertiary-container': '#CEEAD6',
                    'on-tertiary-container': '#0D3B19',

                    // Error
                    error: '#D93025',
                    'on-error': '#FFFFFF',
                    'error-container': '#FCE8E6',
                    'on-error-container': '#5F2120',

                    // Surface
                    surface: '#FAFAFA',
                    'surface-dim': '#F1F3F4',
                    'surface-bright': '#FFFFFF',
                    'surface-container-lowest': '#FFFFFF',
                    'surface-container-low': '#F8F9FA',
                    'surface-container': '#F1F3F4',
                    'surface-container-high': '#E8EAED',
                    'surface-container-highest': '#DADCE0',
                    'on-surface': '#1F1F1F',
                    'on-surface-variant': '#5F6368',

                    // Outline
                    outline: '#DADCE0',
                    'outline-variant': '#E8EAED',

                    // Inverse
                    'inverse-surface': '#303134',
                    'inverse-on-surface': '#E8EAED',
                    'inverse-primary': '#A8C7FA',

                    // Dark mode overrides
                    dark: {
                        primary: '#A8C7FA',
                        'on-primary': '#062E6F',
                        'primary-container': '#0842A0',
                        surface: '#1F1F1F',
                        'surface-container': '#2D2D2D',
                        'on-surface': '#E8EAED',
                        'on-surface-variant': '#9AA0A6',
                        outline: '#5F6368',
                    }
                }
            },

            // M3 Typography
            fontFamily: {
                display: ['"Google Sans"', 'Pretendard', 'sans-serif'],
                body: ['Pretendard', '"Noto Sans KR"', 'sans-serif'],
            },
            fontSize: {
                'display-lg': ['57px', { lineHeight: '64px', fontWeight: '400' }],
                'display-md': ['45px', { lineHeight: '52px', fontWeight: '400' }],
                'display-sm': ['36px', { lineHeight: '44px', fontWeight: '400' }],
                'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '400' }],
                'headline-md': ['28px', { lineHeight: '36px', fontWeight: '400' }],
                'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '400' }],
                'title-lg': ['22px', { lineHeight: '28px', fontWeight: '500' }],
                'title-md': ['16px', { lineHeight: '24px', fontWeight: '500' }],
                'title-sm': ['14px', { lineHeight: '20px', fontWeight: '500' }],
                'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
                'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
                'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
                'label-lg': ['14px', { lineHeight: '20px', fontWeight: '500' }],
                'label-md': ['12px', { lineHeight: '16px', fontWeight: '500' }],
                'label-sm': ['11px', { lineHeight: '16px', fontWeight: '500' }],
            },

            // M3 Shape (Border Radius)
            borderRadius: {
                'xs': '4px',
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '28px',
            },

            // M3 Elevation (Box Shadow)
            boxShadow: {
                'elevation-1': '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
                'elevation-2': '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
                'elevation-3': '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)',
                'elevation-4': '0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)',
                'elevation-5': '0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3)',
            },

            // M3 Motion (Transition)
            transitionDuration: {
                'short1': '50ms',
                'short2': '100ms',
                'short3': '150ms',
                'short4': '200ms',
                'medium1': '250ms',
                'medium2': '300ms',
                'medium3': '350ms',
                'medium4': '400ms',
                'long1': '450ms',
                'long2': '500ms',
            },
            transitionTimingFunction: {
                'standard': 'cubic-bezier(0.2, 0, 0, 1)',
                'standard-decel': 'cubic-bezier(0, 0, 0, 1)',
                'standard-accel': 'cubic-bezier(0.3, 0, 1, 1)',
                'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
                'emphasized-decel': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
                'emphasized-accel': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
            },

            // M3 State Layer
            opacity: {
                'hover': '0.08',
                'focus': '0.12',
                'pressed': '0.12',
                'dragged': '0.16',
            },

            // Spacing
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            }
        },
    },
    plugins: [],
}
