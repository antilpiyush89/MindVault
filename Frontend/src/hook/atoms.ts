import { all } from "axios";
import { atom } from "recoil";


export const enum ContentType{
  Youtube="youtube",
  Twitter="twitter",
  All="all"
}
export const typeAtom = atom<ContentType>({ // defining the type of atom using generic
  key:"typeAtom",
  default:ContentType.Youtube
})

export const OpenAtom = atom<boolean>({ // defining the type of atom using generic
  key:"OpenAtom",
  default:false
})

export const Delatom = atom<boolean>({ // defining the type of atom using generic
  key:"Delatom",
  default:false
})

export const ContentAtom = atom<[]>({ // defining the type of atom using generic
  key:"ContentAtom",
  default:[]
})

export const filterType = atom<ContentType>({
  key:"filterType",
  default:ContentType.All
})

export const SidebarAtom = atom<boolean>({
  key:"filterType",
  default:false
})