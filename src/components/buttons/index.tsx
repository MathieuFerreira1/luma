import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: string;
  variant?: 'primary' | 'secondary';
}

export function PrimaryButton({ children, disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-brand rounded-button py-3.5 px-6 items-center shadow-button ${
        disabled ? 'opacity-50' : ''
      }`}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      <Text className="text-white font-semibold text-base">{children}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ children, disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-white rounded-button py-3.5 px-6 items-center shadow-card border border-secondary-text/20 ${
        disabled ? 'opacity-50' : ''
      }`}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}
    >
      <Text className="text-primary-text font-semibold text-base">{children}</Text>
    </TouchableOpacity>
  );
}
