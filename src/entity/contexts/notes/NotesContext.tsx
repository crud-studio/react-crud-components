import React, {Dispatch, FunctionComponent, PropsWithChildren, SetStateAction, useState} from "react";
import {AbstractJpaUpdatableRO} from "@crud-studio/react-crud-core";

export interface NoteEntityInfoRO {
  displayName: string;
}

export interface NoteRO extends AbstractJpaUpdatableRO {
  content: string;
  targetType: string;
  targetId: string;
  creatorType?: string;
  creatorId?: string;
  creatorInfo?: NoteEntityInfoRO;
  targetInfo?: NoteEntityInfoRO;
}

export type NotesContextProps = {
  targetType: string;
  targetId: number;
  createdNote: NoteRO | undefined;
  setCreatedNote: Dispatch<SetStateAction<NoteRO | undefined>>;
};

const NotesContext = React.createContext<NotesContextProps>(undefined!);

export interface NotesProviderProps extends PropsWithChildren<any> {
  targetType: string;
  targetId: number;
}

const NotesProvider: FunctionComponent<NotesProviderProps> = ({targetType, targetId, children}) => {
  const [createdNote, setCreatedNote] = useState<NoteRO | undefined>(undefined);

  return (
    <NotesContext.Provider
      value={{
        targetType,
        targetId,
        createdNote,
        setCreatedNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export {NotesContext, NotesProvider};
