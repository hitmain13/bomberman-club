# Event Storming (high-level)

## Comandos → Eventos

- `RegisterUser` → `UserRegistered`
- `LoginUser` → `UserLoggedIn`
- `RefreshSession` → `SessionRefreshed`
- `UpdateProfile` → `ProfileUpdated`
- `CreateGarage` → `GarageCreated`
- `AddCar` → `CarAdded`
- `UpdateCar` → `CarUpdated`
- `SetCarSpec` → `CarSpecSet`
- `InstallPartOnCar` → `CarPartInstalled`
- `UploadMedia` → `MediaUploaded`
- `PostSighting` → `SightingPosted`
- `FollowUser` → `UserFollowed`
- `LikeTarget` → `TargetLiked`
- `CommentOnTarget` → `TargetCommented`
- `FavoriteTarget` → `TargetFavorited`

## Reactions

- `UserFollowed` → cria `Notification` para o seguido.
- `TargetLiked` → cria `Notification` para o dono.
- `TargetCommented` → cria `Notification` para o dono.
- `SightingPosted` → invalida cache de feed.
