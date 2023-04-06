module GameMain exposing (..)

{-| Once the user has successfully logged in, this is the entire environment we will care about.
-}

import Chess
import Element exposing (Element)
import Game
import Internal.Tools.Exceptions as X
import Matrix
import Matrix.Room
import Model
import Move
import Msg exposing (Msg)
import PieceColor
import Position
import Task exposing (Task)
import View



-- MODEL


init : Model.LoggedInModel
init =
    Model.BrowsingGames Nothing



-- UPDATE


toCmd : Task X.Error Matrix.VaultUpdate -> Cmd Msg
toCmd =
    Task.attempt (Msg.VaultUpdate >> Msg.LoggedIn)


update : Matrix.Vault -> Msg.LoggedInMsg -> Model.LoggedInModel -> ( Matrix.Vault, Model.LoggedInModel, Cmd Msg )
update vault msg model =
    case ( msg, model ) of
        ( Msg.BrowseGames, _ ) ->
            ( vault, Model.BrowsingGames Nothing, Cmd.none )

        ( Msg.VaultUpdate (Ok u), _ ) ->
            case Chess.resolve vault of
                { accountDataToUpdate, states } ->
                    ( Matrix.updateWith u vault
                    , case model of
                        Model.PlayGame modal info ->
                            states
                                |> List.filter (\state -> state.matchId == info.game.matchId)
                                |> List.head
                                |> Maybe.map
                                    (\g ->
                                        if Game.toEnd g.data.game == Game.toEnd info.game.data.game then
                                            info

                                        else
                                            case g of
                                                { data } ->
                                                    { info
                                                        | game = { g | data = { data | game = Game.toEnd data.game } }
                                                        , selected = Nothing
                                                    }
                                    )
                                |> Maybe.withDefault info
                                |> Model.PlayGame modal

                        _ ->
                            model
                    , accountDataToUpdate
                        |> List.map
                            (\{ data, room } ->
                                Matrix.Room.setAccountData Chess.accountDataEventType data room
                            )
                        |> List.map toCmd
                        |> Cmd.batch
                    )

        ( Msg.VaultUpdate (Err _), _ ) ->
            ( vault, model, Cmd.none )

        ( Msg.ViewGame summary, _ ) ->
            ( vault
            , Model.PlayGame Nothing
                { game = summary
                , selected = Nothing
                , mayMoveBlack = Matrix.username vault == Just summary.data.black
                , mayMoveWhite = Matrix.username vault == Just summary.data.white
                , boardFlipped = Matrix.username vault == Just summary.data.white
                }
            , Cmd.none
            )

        ( Msg.EditCreateGameModal data, Model.BrowsingGames _ ) ->
            ( vault, Model.BrowsingGames (Just <| Model.CreateGame data), Cmd.none )

        ( Msg.EditCreateGameModal modalData, Model.PlayGame _ data ) ->
            ( vault, Model.PlayGame (Just <| Model.CreateGame modalData) data, Cmd.none )

        ( Msg.CreateGame user room, Model.BrowsingGames _ ) ->
            ( vault
            , Model.BrowsingGames Nothing
            , case Matrix.username vault of
                Nothing ->
                    Cmd.none

                Just me ->
                    Matrix.Room.sendOneEvent
                        { content = Chess.encodeInviteEvent { white = me, black = user }
                        , eventType = Chess.gameInviteEventType
                        , stateKey = Nothing
                        }
                        room
                        |> toCmd
            )

        ( Msg.CreateGame user room, Model.PlayGame _ data ) ->
            ( vault
            , Model.PlayGame Nothing data
            , case Matrix.username vault of
                Nothing ->
                    Cmd.none

                Just me ->
                    Matrix.Room.sendOneEvent
                        { content = Chess.encodeInviteEvent { white = me, black = user }
                        , eventType = Chess.gameInviteEventType
                        , stateKey = Nothing
                        }
                        room
                        |> toCmd
            )

        ( Msg.AcceptGame summary, _ ) ->
            ( vault
            , model
            , Matrix.Room.sendOneEvent
                { content = Chess.encodeAcceptChess { reason = Nothing, relatedTo = summary.matchId }
                , eventType = Chess.acceptChessEventType
                , stateKey = Nothing
                }
                summary.room
                |> toCmd
            )

        ( Msg.RejectGame summary, _ ) ->
            ( vault
            , model
            , Matrix.Room.sendOneEvent
                { content = Chess.encodeRejectChess { reason = Nothing, relatedTo = summary.matchId }
                , eventType = Chess.rejectChessEventType
                , stateKey = Nothing
                }
                summary.room
                |> toCmd
            )

        ( _, Model.BrowsingGames _ ) ->
            ( vault, Model.BrowsingGames Nothing, Cmd.none )

        ( Msg.RemoveModal, Model.PlayGame _ data ) ->
            ( vault, Model.PlayGame Nothing data, Cmd.none )

        ( Msg.ClickSquare square, Model.PlayGame modal ({ game, selected, mayMoveBlack, mayMoveWhite } as pg) ) ->
            case game of
                { data, matchId, room } ->
                    let
                        allowedToMove : Bool
                        allowedToMove =
                            if Position.sideToMove (Game.position (Game.toEnd data.game)) == PieceColor.black then
                                mayMoveBlack

                            else
                                mayMoveWhite

                        doNothing : ( Matrix.Vault, Model.LoggedInModel, Cmd Msg )
                        doNothing =
                            ( vault, Model.PlayGame modal { pg | selected = Nothing }, Cmd.none )
                    in
                    if allowedToMove then
                        if Game.isAtEnd data.game then
                            case selected of
                                -- Click on a square to move a piece
                                Nothing ->
                                    ( vault, Model.PlayGame modal { pg | selected = Just square }, Cmd.none )

                                -- Click on a second square in an attempt to move a piece
                                Just oldSquare ->
                                    data.game
                                        |> Game.toEnd
                                        |> Game.position
                                        |> Position.movesFrom oldSquare
                                        |> List.filter (\move -> Move.to move == square)
                                        |> List.head
                                        |> Maybe.map
                                            (\move ->
                                                let
                                                    newGame : Game.Game
                                                    newGame =
                                                        Game.toEnd data.game
                                                            |> Game.addMove move
                                                in
                                                ( vault
                                                , Model.PlayGame modal
                                                    { pg
                                                        | selected = Nothing
                                                        , game = { game | data = { data | game = newGame } }
                                                    }
                                                , Matrix.Room.sendOneEvent
                                                    { content =
                                                        Chess.encodeChessMove
                                                            { newGame = newGame
                                                            , lastMove = data.lastMove
                                                            , relatedTo = matchId
                                                            }
                                                    , eventType = Chess.gameChessMoveEventType
                                                    , stateKey = Nothing
                                                    }
                                                    room
                                                    |> toCmd
                                                )
                                            )
                                        |> Maybe.withDefault ( vault, Model.PlayGame modal { pg | selected = Just square }, Cmd.none )

                        else
                            doNothing

                    else
                        doNothing

        ( Msg.MoveBackwards, Model.PlayGame modal pg ) ->
            case pg of
                { game } ->
                    case game of
                        { data } ->
                            ( vault
                            , Model.PlayGame modal
                                { pg | selected = Nothing, game = { game | data = { data | game = Game.back data.game } } }
                            , Cmd.none
                            )

        ( Msg.MoveForward, Model.PlayGame modal pg ) ->
            case pg of
                { game } ->
                    case game of
                        { data } ->
                            ( vault
                            , Model.PlayGame modal
                                { pg | selected = Nothing, game = { game | data = { data | game = Game.forward data.game } } }
                            , Cmd.none
                            )

        ( Msg.JumpToEnd, Model.PlayGame modal pg ) ->
            case pg of
                { game } ->
                    case game of
                        { data } ->
                            ( vault
                            , Model.PlayGame modal
                                { pg | selected = Nothing, game = { game | data = { data | game = Game.toEnd data.game } } }
                            , Cmd.none
                            )

        ( Msg.FlipBoard, Model.PlayGame modal pg ) ->
            ( vault, Model.PlayGame modal { pg | boardFlipped = not pg.boardFlipped }, Cmd.none )



-- VIEW


view : Matrix.Vault -> Model.LoggedInModel -> Element Msg
view =
    View.loggedInScreen
