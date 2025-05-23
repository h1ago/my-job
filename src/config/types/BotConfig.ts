export interface BotConfig {
  /**
   * Configurações de busca de vagas
   */
  job: JobFetcherConfig;

  /**
   * Configurações de busca de posts
   */
  post: PostFetcherConfig;

  /**
   * Configurações de agendamento do bot
   */
  schedule: ScheduleConfig;
}

/**
 * Configurações para buscadores (fetchers)
 */
export interface JobFetcherConfig {
  /**
   * Número de itens por página na busca
   
   * Obs: Limite máximo que o linkedin permite é 100
   */
  pageSize: 10 | 25 | 50 | 100;
}

export interface PostFetcherConfig {
  /**
   * Número de itens por página na busca
   * Obs: Limite máximo que o linkedin permite é 50
   */
  pageSize: 3 | 10 | 25 | 50;
}

/**
 * Configurações de agendamento
 */
export interface ScheduleConfig {
  /**
   * Intervalo em minutos entre execuções
   */
  interval: number;

  /**
   * Dias da semana em que o bot deve executar (0-6, onde 0 é domingo)
   */
  days: number[];

  /**
   * Horário de funcionamento
   */
  hours: {
    /**
     * Hora de início (0-23)
     */
    start: number;

    /**
     * Hora de término (0-23)
     */
    end: number;
  };
}
