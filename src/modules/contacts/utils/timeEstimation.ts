export interface ProcessingHistory {
  timestamp: number;
  processed: number;
}

export const calculateEstimatedTime = (
  processedContacts: number,
  totalContacts: number,
  history: ProcessingHistory[]
): number | null => {
  if (processedContacts === 0 || totalContacts === 0) return null;
  
  // Precisamos de pelo menos 2 pontos para calcular a taxa
  if (history.length < 2) return null;
  
  // Usar os últimos pontos do histórico para calcular a média móvel
  const recentHistory = history.slice(-5);
  
  // Calcular taxa média (contatos por milissegundo)
  let totalRate = 0;
  for (let i = 1; i < recentHistory.length; i++) {
    const timeDiff = recentHistory[i].timestamp - recentHistory[i - 1].timestamp;
    const contactsDiff = recentHistory[i].processed - recentHistory[i - 1].processed;
    
    if (timeDiff > 0 && contactsDiff > 0) {
      totalRate += contactsDiff / timeDiff;
    }
  }
  
  const averageRate = totalRate / (recentHistory.length - 1);
  
  if (averageRate === 0) return null;
  
  // Calcular tempo restante
  const contactsRemaining = totalContacts - processedContacts;
  const timeRemainingMs = contactsRemaining / averageRate;
  
  return Math.round(timeRemainingMs / 1000); // Retornar em segundos
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seg`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes} min ${secs} seg` : `${minutes} min`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  }
};
