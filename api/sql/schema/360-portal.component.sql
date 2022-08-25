CREATE TABLE [portal].[component] ( -- component configuration override
    componentId VARCHAR(100) NOT NULL, -- id of the component
    componentConfig NVARCHAR(max) NOT NULL, -- configuration
    CONSTRAINT pkComponent PRIMARY KEY CLUSTERED (componentId)
)
