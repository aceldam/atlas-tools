interface Observation {
    _id: number,
    createdAt: string,
    observationDate: string,
    decimalLatitude: number,
    decimalLongitude: number,
    accuracy: number,
    PrimaryDetermination: Determination
}

interface Determination {
    validation: string,
    Taxon: Taxon
}

interface Taxon {
    FullName: string,
    acceptedTaxon: Taxon2 
}

interface Taxon2 {
    Vernacularname_DK: VernacularnameDK
}

interface VernacularnameDK{
    vernacularname_dk: string
}