export function convertDaySizeTwoChars(date: string){

    // separar o dia do resto da data
    let [day, month, year]  = date.split(' ')

    // adicionar um zero caso o numero seja menor que 2 caracteres
    day = day.padStart(2, '0')

    // juntar o dia com o resto da data
   date = `${day} ${month} ${year}`
    
    // retornar data formatada
    return date
}