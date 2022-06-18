interface Command {
  execute():Promise<void> 
}

export {
  Command,
}