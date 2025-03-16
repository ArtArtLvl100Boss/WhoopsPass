import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    whileHover?: boolean;
    withBorder?: boolean;
}

export function AnimatedCard({
    children,
    className,
    delay = 0,
    whileHover = true,
    withBorder = true,
}: AnimatedCardProps) {
    return (
        <motion.div
            className={cn(
                'p-6 rounded-lg bg-background backdrop-blur-sm',
                withBorder && 'border',
                'transition-all duration-200',
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay }}
            whileHover={
                whileHover
                    ? {
                          y: -5,
                          boxShadow:
                              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          borderColor: 'hsl(var(--primary) / 0.3)',
                      }
                    : undefined
            }>
            {children}
        </motion.div>
    );
}
