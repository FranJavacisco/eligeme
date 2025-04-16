import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'highlighted' | 'product' | 'comparison';
    onClick?: () => void;
    hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    onClick,
    hoverable = false,
}) => {
    // Estilos base
    const baseClasses = 'rounded-lg overflow-hidden transition-all duration-200';

    // Estilos según variante
    const variantClasses = {
        default: 'bg-dark-800 border border-gray-800 shadow-md',
        highlighted: 'bg-card-gradient border border-secondary-500 shadow-neon',
        product: 'bg-dark-800 border border-gray-800 shadow-md',
        comparison: 'bg-dark-800 border-2 border-accent-500 shadow-md',
    };

    // Estilos para tarjetas clicables
    const interactiveClasses = onClick || hoverable
        ? 'cursor-pointer transform hover:-translate-y-1 hover:shadow-lg'
        : '';

    // Combinación de clases
    const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${interactiveClasses}
    ${className}
  `;

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};

// Subcomponentes para estructura de Card
Card.Header = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`p-4 border-b border-gray-800 ${className}`}>
        {children}
    </div>
);

Card.Body = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

Card.Footer = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`p-4 border-t border-gray-800 ${className}`}>
        {children}
    </div>
);

Card.Image = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
    <div className="w-full">
        <img src={src} alt={alt} className={`w-full object-cover ${className}`} />
    </div>
);

Card.Badge = ({ children, variant = 'primary', className = '' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'; className?: string }) => {
    const variantClasses = {
        primary: 'bg-secondary-500 text-white',
        secondary: 'bg-gray-600 text-white',
        success: 'bg-accent-500 text-white',
        warning: 'bg-yellow-500 text-white',
        danger: 'bg-red-500 text-white',
    };

    return (
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};

Card.Title = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
        {children}
    </h3>
);

Card.Subtitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <h4 className={`text-sm text-gray-400 ${className}`}>
        {children}
    </h4>
);

Card.Price = ({ price, originalPrice, className = '' }: { price: number; originalPrice?: number; className?: string }) => (
    <div className={`${className}`}>
        {originalPrice && originalPrice > price ? (
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">${price.toLocaleString('es-CL')}</span>
                <span className="text-sm text-gray-400 line-through">${originalPrice.toLocaleString('es-CL')}</span>
            </div>
        ) : (
            <span className="text-xl font-bold text-white">${price.toLocaleString('es-CL')}</span>
        )}
    </div>
);

export default Card;