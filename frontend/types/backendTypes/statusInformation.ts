export interface StatusInformation {
  name: string;
  status: 'HEALTHY' | 'RESPONDING' | 'DEGRADED' | 'DOWN' | 'UNABLE_TO_VERIFY';
}
