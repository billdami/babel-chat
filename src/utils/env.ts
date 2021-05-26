type Environment = 'development' | 'test' | 'production';

export const envVar = (varName: string): string | undefined => {
  return process.env[`REACT_APP_${varName}`];
};

export const env = (): Environment => process.env.NODE_ENV;
