CREATE PROCEDURE portal.[component.get] --returns component config by componentId
    @componentId VARCHAR(100)
AS
SELECT 'component' AS resultSetName, 1 AS single
SELECT
    componentId,
    componentConfig [componentConfig.json]
FROM
    [portal].[component]
WHERE
    componentId = @componentId
