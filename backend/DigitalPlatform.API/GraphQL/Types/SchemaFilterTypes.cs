using DigitalPlatform.API.Models.SourceSystem.FinOps;
using DigitalPlatform.API.Models.SourceSystem.Finance;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;
using DigitalPlatform.API.Models.SourceSystem.Insurance;

namespace DigitalPlatform.API.GraphQL.Types
{
    #region Insurance

    public class InsurancePortfolioSummaryType : ObjectType<InsurancePortfolioSummary>
    {
        protected override void Configure(IObjectTypeDescriptor<InsurancePortfolioSummary> descriptor)
        {
            descriptor
                .Field(f => f.Contacts)
                .UseFiltering()
                .UseSorting();
        }
    }

    public class PortfolioSummaryContactType : ObjectType<PortfolioSummaryContact>
    {
        protected override void Configure(IObjectTypeDescriptor<PortfolioSummaryContact> descriptor)
        {
            descriptor
                .Field(f => f.PolicyDetails)
                .UseFiltering()
                .UseSorting();
        }
    }

    #endregion

    #region Member Central

    public class PersonType : ObjectType<Person>
    {
        protected override void Configure(IObjectTypeDescriptor<Person> descriptor)
        {
            descriptor
                .Field(f => f.PersonSystemIds)
                .UseFiltering()
                .UseSorting();
        }
    }

    public class PersonProductType : ObjectType<PersonProducts>
    {
        protected override void Configure(IObjectTypeDescriptor<PersonProducts> descriptor)
        {
            descriptor
                .Field(f => f.ProductHoldings)
                .UseFiltering()
                .UseSorting();
        }
    }

    #endregion

    #region Finance

    public class FinanceProductResponseType : ObjectType<FinanceProductResponse>
    {
        protected override void Configure(IObjectTypeDescriptor<FinanceProductResponse> descriptor)
        {
            descriptor
                .Field(f => f.PartyProductList)
                .UseFiltering()
                .UseSorting();
        }
    }

    #endregion

    #region FinOps

    public class FinOpsProductHoldingType : ObjectType<FinOpsProductHolding>
    {
        protected override void Configure(IObjectTypeDescriptor<FinOpsProductHolding> descriptor)
        {
            descriptor
                .Field(f => f.ProductHoldingLines)
                .UseFiltering()
                .UseSorting();
        }
    }

    #endregion
}
