module Msg exposing (..)

import Chess exposing (GameSummary)
import Internal.Tools.Exceptions as X
import Matrix
import Matrix.Room
import Model
import Square


type Msg
    = UpdateLogin Model.LoginData
    | SubmitLogin
    | InitialSync (Result X.Error Matrix.VaultUpdate)
    | SyncTime
    | LoggedIn LoggedInMsg


type LoggedInMsg
    = VaultUpdate (Result X.Error Matrix.VaultUpdate)
    | ClickSquare Square.Square
    | MoveForward
    | MoveBackwards
    | ViewGame GameSummary
    | RemoveModal
    | EditCreateGameModal { username : String, room : Maybe Matrix.Room.Room }
    | CreateGame String Matrix.Room.Room
    | BrowseGames
    | JumpToEnd
    | FlipBoard
    | AcceptGame GameSummary
    | RejectGame GameSummary
