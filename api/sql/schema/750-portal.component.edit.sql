ALTER PROCEDURE [portal].[component.edit] -- edit component config
    @component [portal].componentTT READONLY, -- component to edit
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS

DECLARE @callParams XML
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @componentId VARCHAR(100) = (SELECT componentId FROM @component)
DECLARE @TranCounter INT = @@TRANCOUNT

BEGIN TRY
    --ut-permission-check
    IF @TranCounter = 0 BEGIN TRANSACTION
        MERGE INTO
            portal.component AS target
        USING
            @component AS source
        ON
            target.componentId = source.componentId
        WHEN NOT MATCHED BY TARGET THEN
        INSERT
            (componentId, componentConfig)
        VALUES
            (source.componentId, source.componentConfig)
        WHEN MATCHED THEN
        UPDATE SET
            target.componentConfig = source.componentConfig;
    IF @TranCounter = 0 COMMIT TRANSACTION
    EXEC core.auditCall @procid = @@PROCID, @params = @callParams
    EXEC [portal].[component.get] @componentId = @componentId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION

    IF error_number() NOT IN (2627)
    BEGIN
        EXEC [core].[error]
    END
    ELSE
    BEGIN TRY
        RAISERROR('Component configuration already exists', 16, 1);
    END TRY
    BEGIN CATCH
        EXEC [core].[error]
    END CATCH
END CATCH
