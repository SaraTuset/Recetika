export let people = new Map()

//people.set(ejemplo, 1234)

export function setPerson(name, calories){
    people.set(name,calories)
}

export function getPeople(){
    return people
}