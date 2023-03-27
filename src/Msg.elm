module Msg exposing (..)

import Internal.Tools.Exceptions as X
import Matrix
import Model


type Msg
    = UpdateLogin Model.LoginData
    | SubmitLogin
    | InitialSync (Result X.Error Matrix.VaultUpdate)
