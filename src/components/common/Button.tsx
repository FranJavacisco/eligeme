// src/components/common/Button.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon,
    iconPosition = 'left',
    loading = false,
    className = '',
    disabled,
    ...props
}) => {
    // Estilos base
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed';

    // Estilos según variante
    const variantClasses = {
        primary: 'bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 text-white focus:ring-secondary-400',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
        outline: 'bg-transparent border border-secondary-500 text-secondary-400 hover:bg-secondary-500 hover:bg-opacity-10 focus:ring-secondary-400',
        ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white focus:ring-gray-500',
        link: 'bg-transparent text-secondary-400 hover:text-secondary-300 hover:underline focus:ring-0 p-0',
    };

    // Estilos según tamaño
    const sizeClasses = {
        sm: 'text-xs py-1.5 px-3 rounded',
        md: 'text-sm py-2 px-4 rounded-md',
        lg: 'text-base py-3 px-6 rounded-md',
    };

    // Combinación de clases
    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}

            {icon && iconPosition === 'left' && !loading && (
                <span className="mr-2">{icon}</span>
            )}

            {children}

            {icon && iconPosition === 'right' && (
                <span className="ml-2">{icon}</span>
            )}
        </button>
    );
};

export default Button;