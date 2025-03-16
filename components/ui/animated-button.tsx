'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Create a motion button based on the Button component
const ForwardedButton = forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => (
        <Button
            {...props}
            ref={ref}
        />
    )
);

ForwardedButton.displayName = 'ForwardedButton';

// Define a type that combines Button props with motion props
type MotionButtonProps = ButtonProps &
    Omit<HTMLMotionProps<'button'>, keyof ButtonProps>;

// Create the motion button with proper typing
const MotionButton = motion(
    ForwardedButton
) as unknown as React.ForwardRefExoticComponent<
    MotionButtonProps & React.RefAttributes<HTMLButtonElement>
>;

(
    MotionButton as React.ForwardRefExoticComponent<
        MotionButtonProps & React.RefAttributes<HTMLButtonElement>
    >
).displayName = 'MotionButton';

export interface AnimatedButtonProps extends MotionButtonProps {
    animationType?: 'pulse' | 'float' | 'scale' | 'gradient' | 'none';
    gradientFrom?: string;
    gradientTo?: string;
}

export const AnimatedButton = forwardRef<
    HTMLButtonElement,
    AnimatedButtonProps
>(
    (
        {
            className,
            children,
            animationType = 'none',
            gradientFrom = 'from-primary',
            gradientTo = 'to-blue-600',
            ...props
        },
        ref
    ) => {
        // Define base classes
        const baseClasses = cn(
            className,
            animationType === 'gradient' &&
                `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white hover:opacity-90`
        );

        // Get animation props based on animationType
        const getAnimationProps = () => {
            switch (animationType) {
                case 'pulse':
                    return {
                        animate: {
                            scale: [1, 1.05, 1],
                        },
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'loop' as const,
                        },
                    };
                case 'float':
                    return {
                        animate: {
                            y: [0, -5, 0],
                        },
                        transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'loop' as const,
                        },
                        whileHover: {
                            y: -5,
                        },
                        whileTap: {
                            scale: 0.95,
                        },
                    };
                case 'scale':
                    return {
                        whileHover: {
                            scale: 1.05,
                            boxShadow:
                                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        },
                        whileTap: {
                            scale: 0.95,
                        },
                    };
                case 'gradient':
                case 'none':
                default:
                    return {
                        whileHover: {
                            scale: 1.03,
                        },
                        whileTap: {
                            scale: 0.97,
                        },
                    };
            }
        };

        const animationProps = getAnimationProps();

        return (
            <MotionButton
                className={baseClasses}
                ref={ref}
                {...animationProps}
                {...props}>
                {children}
            </MotionButton>
        );
    }
);

AnimatedButton.displayName = 'AnimatedButton';
