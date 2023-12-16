export default interface IUser {
    id?: string | null,
    fullname: string,
    email: string,
    permission: string,
    document: string,
    image_path: string,
    position: string,
    status: string,
  }