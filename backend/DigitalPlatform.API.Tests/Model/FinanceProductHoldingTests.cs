using DigitalPlatform.API.Models.Products.AnnuityProducts;
using DigitalPlatform.API.Models.SourceSystem.Finance;

namespace DigitalPlatform.API.Tests.Models.Products.AnnuityProducts
{
    [TestFixture]
    public class FinanceProductHoldingTests
    {
        [Test]
        public void ExpiryDate_WhenLoanIsNull_ReturnsEmptyString()
        {
            // Arrange
            var financeProductHolding = new FinanceProductHolding(null!);

            // Act
            var expiryDate = financeProductHolding.ExpiryDate;

            // Assert
            Assert.That(expiryDate, Is.EqualTo(string.Empty));
        }

        [Test]
        public void ExpiryDate_WhenExpiryDateAndMaturityDateAreNull_ReturnsEmptyString()
        {
            // Arrange
            var product = new FinanceLoan { ExpiryDate = null, MaturityDate = null };
            var financeProductHolding = new FinanceProductHolding(product);

            // Act
            var expiryDate = financeProductHolding.ExpiryDate;

            // Assert
            Assert.That(expiryDate, Is.EqualTo(string.Empty));
        }

        [Test]
        public void ExpiryDate_WhenExpiryDateIsNull_ReturnsMaturityDate()
        {
            // Arrange
            var maturityDate = new DateTime(2024, 1, 1);
            var product = new FinanceLoan { ExpiryDate = null, MaturityDate = maturityDate };
            var financeProductHolding = new FinanceProductHolding(product);

            // Act
            var expiryDate = financeProductHolding.ExpiryDate;

            // Assert
            Assert.That(expiryDate, Is.EqualTo(maturityDate.ToString("dd MMM yyyy")));
        }

        [Test]
        public void ExpiryDate_WhenMaturityDateIsNull_ReturnsExpiryDate()
        {
            // Arrange
            var expiryDate = new DateTime(2024, 1, 1);
            var product = new FinanceLoan { ExpiryDate = expiryDate, MaturityDate = null };
            var financeProductHolding = new FinanceProductHolding(product);

            // Act
            var result = financeProductHolding.ExpiryDate;

            // Assert
            Assert.That(result, Is.EqualTo(expiryDate.ToString("dd MMM yyyy")));
        }
        [Test]
        public void InterestFrequency_WhenLoanIsNull_ReturnsEmptyString()
        {
            // Arrange
            var financeProductHolding = new FinanceProductHolding(null!); 

            // Act
            var result = financeProductHolding.InterestFrequency;

            // Assert
            Assert.That(result, Is.EqualTo(string.Empty));
        }

        [TestCase("Annual", "paid annually")]
        [TestCase("Quarterly", "paid quarterly")]
        [TestCase("Monthly", "paid monthly")]
        [TestCase("6 Monthly Interest", "paid 6 monthly")]
        public void InterestFrequency_WhenLoanInterestFrequencyIsValid_ReturnsExpectedResult(string interestFrequency, string expectedResult)
        {
            // Arrange
            var product = new FinanceLoan { InterestFrequency = interestFrequency };
            var financeProductHolding = new FinanceProductHolding(product); 
            // Act
            var result = financeProductHolding.InterestFrequency;

            // Assert
            Assert.That(result, Is.EqualTo(expectedResult));
        }

        [Test]
        public void InterestFrequency_WhenLoanInterestFrequencyIsNull_ReturnsEmptyString()
        {
            // Arrange
            var product = new FinanceLoan { InterestFrequency = null! };
            var financeProductHolding = new FinanceProductHolding(product); 

            // Act
            var result = financeProductHolding.InterestFrequency;

            // Assert
            Assert.That(result, Is.EqualTo(string.Empty));
        }

        [Test]
        public void InterestFrequency_WhenLoanInterestFrequencyIsEmpty_ReturnsEmptyString()
        {
            // Arrange
            var product = new FinanceLoan { InterestFrequency = null! };
            var financeProductHolding = new FinanceProductHolding(product); 

            // Act
            var result = financeProductHolding.InterestFrequency;

            // Assert
            Assert.That(result, Is.EqualTo(string.Empty));
        }

    }
}