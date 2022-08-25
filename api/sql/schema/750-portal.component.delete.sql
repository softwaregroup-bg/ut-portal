ALTER PROCEDURE [portal].[component.delete] --delete component configurations
    @componentId [core].[arrayList] READONLY, --component ids
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
DECLARE @callParams XML
DECLARE @TranCounter INT = @@TRANCOUNT
SELECT 'component' AS resultSetName
BEGIN TRY
    --ut-permission-check
    IF @TranCounter = 0 BEGIN TRANSACTION
        DELETE FROM
            portal.component
        OUTPUT
            deleted.componentId
        WHERE
            componentId IN (SELECT [value] FROM @componentId)
    IF @TranCounter = 0 COMMIT TRANSACTION
    EXEC core.auditCall @procid = @@PROCID, @params = @callParams
END TRY
BEGIN CATCH
    IF @@trancount > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
