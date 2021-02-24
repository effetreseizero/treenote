export interface Survey {
    user_uid: string;
    deleted: boolean;
    created_time: number;
    data_ora_osservazione:string;
    latitudine: number;
    longitudine: number;
    quota: number;
    localita: string;
    tipologia: string;
    identificazione: string;
    nome_comune?: string;
    loc_problema: string;
    commenti: string;
    specie: string;
    nome_scientifico?: string;
    sintomi: string;
    diffusione_perc: string;
    alberi_morti: string;
}

