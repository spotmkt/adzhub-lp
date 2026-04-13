import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				'color-1': 'hsl(var(--color-1))',
				'color-2': 'hsl(var(--color-2))',
				'color-3': 'hsl(var(--color-3))',
				'color-4': 'hsl(var(--color-4))',
				'color-5': 'hsl(var(--color-5))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				/* Custom chat interface colors */
				chat: {
					background: 'hsl(var(--chat-background))',
					'bubble-user': 'hsl(var(--chat-bubble-user))',
					'bubble-ai': 'hsl(var(--chat-bubble-ai))',
					input: 'hsl(var(--chat-input))'
				},
				nav: {
					background: 'hsl(var(--nav-background))',
					item: 'hsl(var(--nav-item))',
					'item-active': 'hsl(var(--nav-item-active))'
				},
				action: {
					panel: 'hsl(var(--action-panel))',
					card: 'hsl(var(--action-card))',
					'card-hover': 'hsl(var(--action-card-hover))'
				},
				glass: {
					background: 'hsl(var(--glass-background))',
					border: 'hsl(var(--glass-border))'
				}
			},
			boxShadow: {
				'glow': '0 0 20px hsl(var(--shadow-glow))',
				'glow-lg': '0 0 40px hsl(var(--shadow-glow))',
				'inner-glass': 'inset 0 1px 0 hsl(var(--glass-border))'
			},
			backdropBlur: {
				'glass': '12px'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'skew-scroll': {
					'0%': {
						transform: 'rotateX(20deg) rotateZ(-20deg) skewX(20deg)',
					},
					'100%': {
						transform: 'rotateX(20deg) rotateZ(-20deg) skewX(20deg) translateY(-100%)',
					}
				},
				'star-movement-bottom': {
					'0%': { transform: 'translate(0%, 0%)', opacity: '1' },
					'100%': { transform: 'translate(-100%, 0%)', opacity: '0' }
				},
				'star-movement-top': {
					'0%': { transform: 'translate(0%, 0%)', opacity: '1' },
					'100%': { transform: 'translate(100%, 0%)', opacity: '0' }
				},
				'rainbow': {
					'0%': { 'background-position': '0%' },
					'100%': { 'background-position': '200%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'skew-scroll': 'skew-scroll 20s linear infinite',
				'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
				'star-movement-top': 'star-movement-top linear infinite alternate',
				'rainbow': 'rainbow var(--speed, 2s) infinite linear'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
