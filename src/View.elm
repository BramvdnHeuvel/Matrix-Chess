module View exposing (..)

import Chess
import Colors as C
import Element exposing (Element)
import Element.Background
import Element.Border
import Element.Events
import Element.Font
import Element.Input as Input
import Game
import Html.Attributes
import Json.Decode as D
import Material.Icons as Icons
import Material.Icons.Types as T
import Matrix
import Matrix.Event
import Matrix.Room
import Model
import Move
import Msg exposing (Msg)
import Piece
import Pieces
import Position
import Square
import SquareFile
import SquareRank
import StringExtra as S
import Widget
import Widget.Icon
import Widget.Material as Material


{-| Field that lets you fill in a password.
-}
accessTokenField : Model.LoginData -> Bool -> Element Msg
accessTokenField model editable =
    Widget.currentPasswordInputV2
        (Material.passwordInput
            (if editable then
                C.primaryPalette

             else
                C.primaryPalette
            )
        )
        { text = model.accessToken
        , placeholder =
            Element.text "Access token"
                |> Input.placeholder []
                |> Just
        , label = "Access token"
        , onChange =
            \accessToken ->
                if editable then
                    Msg.UpdateLogin { model | accessToken = accessToken }

                else
                    Msg.UpdateLogin model
        , show = False
        }
        |> Element.el
            [ Element.centerX ]


{-| Field that lets you fill in a baseUrl.
-}
baseUrlField : Model.LoginData -> Bool -> Element Msg
baseUrlField model editable =
    Widget.textInput
        (Material.textInput
            (if editable then
                C.primaryPalette

             else
                C.primaryPalette
            )
        )
        { chips = []
        , text = model.baseUrl
        , placeholder =
            Element.text "Homeserver URL"
                |> Input.placeholder []
                |> Just
        , label = "Homeserver URL"
        , onChange =
            \baseUrl ->
                if editable then
                    Msg.UpdateLogin { model | baseUrl = S.withHttps baseUrl }

                else
                    Msg.UpdateLogin model
        }
        |> Element.el
            [ Element.centerX ]


board : Position.Position -> List Square.Square -> Maybe Move.Move -> Element Msg
board position selectedDestinations lastMove =
    SquareFile.all
        |> List.map
            (\file ->
                SquareRank.all
                    |> List.map
                        (\rank ->
                            let
                                square : Square.Square
                                square =
                                    Square.make file rank

                                backgroundColor : Element.Attribute msg
                                backgroundColor =
                                    if Maybe.map Move.from lastMove == Just square then
                                        C.background C.noordstarYellow

                                    else if Maybe.map Move.to lastMove == Just square then
                                        C.background C.noordstarYellow

                                    else if (Square.fileDistance Square.a1 square + Square.rankDistance Square.a1 square |> modBy 2) == 0 then
                                        C.background C.noordstarWhite

                                    else
                                        C.background C.noordstarGreen
                            in
                            Element.el
                                [ Element.height Element.fill
                                , Element.width Element.fill
                                , backgroundColor
                                , Element.Events.onClick <| Msg.LoggedIn (Msg.ClickSquare square)
                                ]
                                (case Position.pieceOn square position of
                                    Nothing ->
                                        Element.none

                                    Just piece ->
                                        chessPiece piece
                                )
                        )
            )
        |> List.map (Element.column [ Element.width Element.fill, Element.height Element.fill ])
        |> Element.row [ Element.width Element.fill, Element.height Element.fill ]
        |> Element.el
            [ Element.htmlAttribute (Html.Attributes.style "aspect-ratio" "1 / 1")
            ]


boardMenu : Game.Game -> Element Msg
boardMenu game =
    Widget.buttonRow
        { elementRow = Material.buttonRow
        , content = Material.outlinedButton C.secondaryPalette
        }
        [ ( False
          , { text = "Resign"
            , icon = getIcon Icons.flag
            , onPress = Nothing
            }
          )
        , ( Game.isAtBeginning game
          , { text = "Previous"
            , icon = getIcon Icons.arrow_back
            , onPress =
                if Game.isAtBeginning game then
                    Nothing

                else
                    Just (Msg.LoggedIn Msg.MoveBackwards)
            }
          )
        , ( Game.isAtEnd game
          , { text = "Next"
            , icon = getIcon Icons.arrow_forward
            , onPress =
                if Game.isAtEnd game then
                    Nothing

                else
                    Just (Msg.LoggedIn Msg.MoveForward)
            }
          )
        , ( Game.isAtEnd game
          , { text = "Now"
            , icon = getIcon Icons.fast_forward
            , onPress =
                if Game.isAtEnd game then
                    Nothing

                else
                    Just (Msg.LoggedIn Msg.JumpToEnd)
            }
          )
        ]


boardTopMenu : Element Msg
boardTopMenu =
    Widget.buttonRow
        { elementRow = Material.toggleRow
        , content = Material.outlinedButton C.secondaryPalette
        }
        [ ( False
          , { text = "Back"
            , icon = getIcon Icons.arrow_back
            , onPress = Just <| Msg.LoggedIn <| Msg.BrowseGames
            }
          )
        ]


chessPiece : Piece.Piece -> Element msg
chessPiece piece =
    (if piece == Piece.blackBishop then
        Pieces.blackBishop

     else if piece == Piece.blackKing then
        Pieces.blackKing

     else if piece == Piece.blackKnight then
        Pieces.blackHorse

     else if piece == Piece.blackPawn then
        Pieces.blackPawn

     else if piece == Piece.blackQueen then
        Pieces.blackQueen

     else if piece == Piece.blackRook then
        Pieces.blackTower

     else if piece == Piece.whiteBishop then
        Pieces.whiteBishop

     else if piece == Piece.whiteKing then
        Pieces.whiteKing

     else if piece == Piece.whiteKnight then
        Pieces.whiteHorse

     else if piece == Piece.whitePawn then
        Pieces.whitePawn

     else if piece == Piece.whiteQueen then
        Pieces.whiteQueen

     else
        Pieces.whiteTower
    )
        |> Element.html


{-| Material column
-}
column : List (Element msg) -> Element msg
column =
    Widget.column Material.column


{-| Modal to create a new game.
-}
createGame : Matrix.Vault -> { username : String, room : Maybe Matrix.Room.Room } -> Widget.Modal Msg
createGame vault data =
    { onDismiss = Just <| Msg.LoggedIn Msg.RemoveModal
    , content =
        Matrix.getRooms vault
            |> List.map
                (\room ->
                    let
                        roomName : String
                        roomName =
                            Matrix.Room.stateEvent { eventType = "m.room.name", stateKey = "" } room
                                |> Maybe.map Matrix.Event.content
                                |> Maybe.andThen (D.decodeValue (D.field "name" D.string) >> Result.toMaybe)
                                |> Maybe.withDefault (Matrix.Room.roomId room)
                    in
                    Widget.fullBleedItem
                        (if
                            data.room
                                |> Maybe.map Matrix.Room.roomId
                                |> Maybe.map ((==) (Matrix.Room.roomId room))
                                |> Maybe.withDefault False
                         then
                            Material.fullBleedItem C.primaryPalette

                         else
                            Material.fullBleedItem C.secondaryPalette
                        )
                        { text = roomName
                        , onPress = Just <| Msg.LoggedIn <| Msg.EditCreateGameModal { data | room = Just room }
                        , icon =
                            \{ size, color } ->
                                room
                                    |> Matrix.Room.stateEvent { eventType = "m.room.avatar", stateKey = "" }
                                    |> Maybe.map Matrix.Event.content
                                    |> Maybe.andThen (D.decodeValue (D.field "url" D.string) >> Result.toMaybe)
                                    |> Maybe.map
                                        (\url ->
                                            if String.startsWith "mxc://" url then
                                                url
                                                    |> String.dropLeft (String.length "mxc://")
                                                    |> (\u -> "https://matrix-client.matrix.org/_matrix/media/r0/thumbnail/" ++ u ++ "?width=" ++ String.fromInt size ++ "&height=" ++ String.fromInt size ++ "&method=scale")

                                            else
                                                "https://matrix-client.matrix.org/_matrix/media/r0/thumbnail/" ++ url ++ "?width=" ++ String.fromInt size ++ "&height=" ++ String.fromInt size ++ "&method=scale"
                                        )
                                    |> Maybe.map (\url -> { src = url, description = "Matrix room image" })
                                    |> Maybe.map (Element.image [ Element.height (Element.px size), Element.width (Element.px size) ])
                                    |> Maybe.withDefault
                                        (roomName
                                            |> String.toList
                                            |> List.head
                                            |> Maybe.withDefault '!'
                                            |> String.fromChar
                                            |> String.toUpper
                                            |> Element.text
                                            |> Element.el
                                                [ Element.centerX, Element.centerY ]
                                            |> Element.el
                                                [ C.background color
                                                , C.font C.noordstarWhite
                                                , Element.width (Element.px size)
                                                , Element.height (Element.px size)
                                                ]
                                        )
                        }
                )
            |> List.append [ Widget.headerItem (Material.fullBleedHeader C.secondaryPalette) "Select a room" ]
            |> Widget.itemList (Material.cardColumn C.secondaryPalette)
            |> Element.el [ Element.width Element.fill ]
            |> (\roomList ->
                    Element.column
                        [ Element.width Element.fill ]
                        [ Element.row [ Element.centerX ]
                            [ Widget.textInput
                                (Material.textInput Material.defaultPalette)
                                { chips = []
                                , text = data.username
                                , placeholder = Just <| Input.placeholder [] <| Element.text "@alice:example.org"
                                , label = "Username"
                                , onChange = \v -> Msg.LoggedIn <| Msg.EditCreateGameModal { data | username = v }
                                }
                                |> Element.el [ Element.width Element.fill ]
                            , Widget.textButton (Material.outlinedButton C.secondaryPalette)
                                { text = "INVITE"
                                , onPress =
                                    case ( data.username, data.room ) of
                                        ( _, Nothing ) ->
                                            Nothing

                                        ( "", _ ) ->
                                            Nothing

                                        ( _, Just room ) ->
                                            room
                                                |> Matrix.Room.stateEvent { eventType = "m.room.member", stateKey = data.username }
                                                |> Maybe.map Matrix.Event.content
                                                |> Maybe.andThen (D.decodeValue (D.field "membership" D.string) >> Result.toMaybe)
                                                |> Maybe.andThen
                                                    (\membership ->
                                                        if membership == "join" then
                                                            Just <| Msg.LoggedIn <| Msg.CreateGame data.username room

                                                        else
                                                            Nothing
                                                    )
                                }
                            ]
                        , roomList

                        -- , data.error
                        --     |> Maybe.withDefault ""
                        --     |> Element.text
                        --     |> Element.el [ C.font C.noordstarRed ]
                        ]
               )
            |> Element.el
                [ Element.centerX
                , Element.centerY
                , Element.width <| Element.minimum 400 <| Element.shrink
                ]
    }


{-| Place an error message.
-}
errorMessage : Maybe String -> Element msg
errorMessage error =
    case error of
        Nothing ->
            Element.none

        Just e ->
            Element.el
                [ Element.width Element.fill
                , Element.Background.color (Element.rgb 1 0 0)
                , Element.Font.color (Element.rgb 1 1 1)
                , Element.padding 5
                ]
                (Element.text e)


{-| Get an icon from the Material library
-}
getIcon : T.Icon msg -> Widget.Icon.Icon msg
getIcon =
    Widget.Icon.elmMaterialIcons T.Color


{-| View when logging in, or when trying to authenticate.
-}
loginScreen : Model.LoginData -> Bool -> Element Msg
loginScreen model editable =
    Widget.tab
        (Material.tab C.primaryPalette)
        { tabs =
            { selected =
                case model.screen of
                    Model.AccessTokenScreen ->
                        Just 0

                    Model.UsernameAndPasswordScreen ->
                        Just 1
            , options =
                [ { text = "Access token", icon = getIcon Icons.local_activity }
                , { text = "Username & password", icon = getIcon Icons.password }
                ]
            , onSelect =
                \i ->
                    case i of
                        0 ->
                            Just (Msg.UpdateLogin { model | screen = Model.AccessTokenScreen })

                        1 ->
                            Just (Msg.UpdateLogin { model | screen = Model.UsernameAndPasswordScreen })

                        _ ->
                            Nothing
            }
        , content =
            \i ->
                (case i of
                    Just 0 ->
                        [ errorMessage model.error
                        , baseUrlField model editable
                        , accessTokenField model editable
                        , submitField model editable
                        ]

                    Just 1 ->
                        [ errorMessage model.error
                        , baseUrlField model editable
                        , usernameField model editable
                        , passwordField model editable
                        , submitField model editable
                        ]

                    _ ->
                        [ errorMessage model.error
                        , baseUrlField model editable
                        , accessTokenField model editable
                        , submitField model editable
                        ]
                )
                    |> Element.column
                        [ Element.centerX
                        , Element.spacing 20
                        , Element.padding 20
                        ]
        }
        |> Element.el (Material.cardAttributes Material.defaultPalette)
        |> Element.el
            [ Element.fill
                |> Element.maximum 750
                |> Element.width
            , Element.centerX
            ]


{-| Main screen after having logged in successfully.
-}
loggedInScreen : Matrix.Vault -> Model.LoggedInModel -> Element Msg
loggedInScreen vault model =
    let
        knownGames : List Chess.GameSummary
        knownGames =
            Chess.getGames vault
    in
    case model of
        Model.BrowsingGames _ ->
            (case knownGames of
                [] ->
                    Element.text "I could not detect any games. Try to create one!"

                _ :: _ ->
                    knownGames
                        |> List.reverse
                        |> List.map
                            (\({ data } as summary) ->
                                Widget.imageItem
                                    (Material.imageItem C.primaryPalette)
                                    { text = Chess.opponent vault summary ++ " - turn " ++ (String.fromInt <| List.length <| Game.moves data.game)
                                    , onPress = Just <| Msg.LoggedIn <| Msg.ViewGame summary
                                    , image =
                                        board (Game.position data.game) [] (Game.previousMove data.game)
                                            |> Element.el [ Element.width (Element.px 40), Element.height (Element.px 40) ]
                                    , content =
                                        \{ size, color } ->
                                            if Chess.myTurn vault summary then
                                                Element.text "YOUR TURN"
                                                    |> Element.el
                                                        [ C.background color
                                                        , C.font C.noordstarWhite
                                                        , Element.height (Element.px size)
                                                        , Element.Border.rounded 15
                                                        , Element.padding 5
                                                        ]

                                            else
                                                Element.none
                                    }
                            )
                        |> Widget.itemList (Material.cardColumn C.primaryPalette)
            )
                |> (\content ->
                        Element.column
                            [ Element.width Element.fill, Element.spacing 20 ]
                            [ Widget.textButton (Material.textButton C.darkPalette)
                                { text = "CREATE", onPress = Just <| Msg.LoggedIn <| Msg.EditCreateGameModal { username = "", room = Nothing } }
                                |> Element.el [ Element.alignRight ]
                            , content
                            ]
                   )
                |> Element.el (Material.cardAttributes Material.defaultPalette)
                |> Element.el
                    [ Element.shrink
                        |> Element.maximum 750
                        |> Element.width
                    , Element.centerX
                    ]

        Model.PlayGame _ data ->
            [ boardTopMenu
            , board
                (Game.position data.game.data.game)
                (case data.selected of
                    Nothing ->
                        []

                    Just square ->
                        Game.position data.game.data.game
                            |> Position.movesFrom square
                            |> List.map Move.to
                )
                (Game.previousMove data.game.data.game)
            , boardMenu data.game.data.game
            ]
                |> Element.column (Material.cardAttributes Material.defaultPalette)
                |> Element.el
                    [ Element.fill
                        |> Element.maximum 500
                        |> Element.width
                    , Element.centerX
                    ]


{-| Field that lets you fill in a password.
-}
passwordField : Model.LoginData -> Bool -> Element Msg
passwordField model editable =
    Widget.currentPasswordInputV2
        (Material.passwordInput
            (if editable then
                Material.defaultPalette

             else
                C.primaryPalette
            )
        )
        { text = model.password
        , placeholder =
            Element.text "Password"
                |> Input.placeholder []
                |> Just
        , label = "Password"
        , onChange =
            \password ->
                if editable then
                    Msg.UpdateLogin { model | password = password }

                else
                    Msg.UpdateLogin model
        , show = False
        }
        |> Element.el
            [ Element.centerX ]


{-| Material styled row
-}
row : List (Element msg) -> Element msg
row =
    Widget.row Material.row


{-| When provided a modal, show it.
-}
showModalScreen : Matrix.Vault -> Model.ModalScreen -> Widget.Modal Msg
showModalScreen vault screen =
    case screen of
        Model.CreateGame data ->
            createGame vault data


{-| Field that lets you submit your credentials when you'd like to log in.
-}
submitField : Model.LoginData -> Bool -> Element Msg
submitField model submittable =
    let
        hideButton : Bool
        hideButton =
            if String.length model.baseUrl > S.httpsLen then
                case model.screen of
                    Model.AccessTokenScreen ->
                        String.length model.accessToken == 0

                    Model.UsernameAndPasswordScreen ->
                        String.length model.username * String.length model.password == 0

            else
                True
    in
    Widget.textButton
        (Material.outlinedButton C.primaryPalette)
        { text = "Login"
        , onPress =
            if submittable then
                Just Msg.SubmitLogin

            else
                Nothing
        }
        |> Element.el [ Element.transparent hideButton, Element.centerX ]


{-| Field that lets you fill in a username.
-}
usernameField : Model.LoginData -> Bool -> Element Msg
usernameField model editable =
    Widget.usernameInput
        (Material.textInput
            (if editable then
                C.primaryPalette

             else
                C.primaryPalette
            )
        )
        { chips = []
        , text = model.username
        , placeholder =
            Element.text "Username"
                |> Input.placeholder []
                |> Just
        , label = "Username"
        , onChange =
            \username ->
                if editable then
                    Msg.UpdateLogin { model | username = username }

                else
                    Msg.UpdateLogin model
        }
        |> Element.el
            [ Element.centerX ]
