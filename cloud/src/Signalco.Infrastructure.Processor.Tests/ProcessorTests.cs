using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Signal.Core;
using Signal.Core.Contacts;
using Signal.Core.Entities;
using Signal.Core.Processor;
using Signal.Core.Secrets;
using Signal.Infrastructure.Secrets;
using Signalco.Infrastructure.Processor.Configuration.Schemas;
using Xunit;
using ContactPointer = Signal.Core.Contacts.ContactPointer;

namespace Signalco.Infrastructure.Processor.Tests;

public class ProcessorTests
{
    [Fact]
    public void Processor_Ctor()
    {
        Assert.NotNull(Processor((typeof(IEntityService), new Mock<IEntityService>().Object)));
    }

    [Fact]
    public async Task Processor_NullArgs_EntityId()
    {
        var processor = Processor((typeof(IEntityService), new Mock<IEntityService>().Object));
        await Assert.ThrowsAsync<ArgumentNullException>(() => processor.RunProcessAsync(null!, null!, false));
    }

    [Fact]
    public async Task Processor_NullArgs_Trigger()
    {
        var processor = Processor((typeof(IEntityService), new Mock<IEntityService>().Object));
        await Assert.ThrowsAsync<ArgumentNullException>(() => processor.RunProcessAsync("", null!, false));
    }

    [Fact]
    public async Task Processor_NoContacts()
    {
        var mock = new Mock<IEntityService>();
        mock.Setup(s => s.ContactsAsync("", CancellationToken.None)).Returns(Task.FromResult(Enumerable.Empty<IContact>()));

        var processor = Processor((typeof(IEntityService), mock.Object));
        await processor.RunProcessAsync("", new ContactPointer(null!, null!, null!), false);
    }

    [Fact]
    public async Task Processor_EmptyConfiguration()
    {
        var mock = new Mock<IEntityService>();
        mock.Setup(s => s.ContactsAsync("", CancellationToken.None)).Returns(Task.FromResult(new List<IContact>
        {
            new Contact("", "signalco", "configuration", "", DateTime.UtcNow, null)
        }.AsEnumerable()));

        var processor = Processor((typeof(IEntityService), mock.Object));
        await processor.RunProcessAsync("", new ContactPointer(null!, null!, null!), false);
    }

    [Fact]
    public async Task Processor_InvalidConfiguration()
    {
        var mock = new Mock<IEntityService>();
        mock.Setup(s => s.ContactsAsync("", default)).Returns(Task.FromResult(new List<IContact>
        {
            new Contact("", "signalco", "configuration", "{}", DateTime.UtcNow, null)
        }.AsEnumerable()));

        var processor = Processor((typeof(IEntityService), mock.Object));
        await processor.RunProcessAsync("", new ContactPointer(null!, null!, null!), false);
    }

    [Fact]
    public async Task Processor_ValidConfiguration()
    {
        var mock = new Mock<IEntityService>();
        mock.Setup(s => s.ContactsAsync("", default)).Returns(Task.FromResult(new List<IContact>
        {
            new Contact("", "signalco", "configuration", JsonSerializer.Serialize(new ProcessConfiguration
            {
                Schema = "",
                Type = ProcessType.Basic,
                Conducts = new List<Conduct>
                {
                    new ConductEntityContact
                    {
                        Type = "contact",
                        Id = Guid.NewGuid().ToString(),
                        Conditions = new List<Condition>
                        {
                            new ConditionConst
                            {
                                Type = "value",
                                ValueSerialized = "test"
                            }
                        },
                        Contacts = new List<ConductContact>()
                    }
                }
            }), DateTime.UtcNow, null)
        }.AsEnumerable()));

        var processor = Processor((typeof(IEntityService), mock.Object));
        await processor.RunProcessAsync("", new ContactPointer(null!, null!, null!), false);
    }

    [Fact]
    public async Task Processor_TriggerContact()
    {
        var secretsProviderMock = new Mock<ISecretsProvider>();
        secretsProviderMock
            .Setup(s => s.GetSecretAsync(SecretKeys.ProcessorAccessCode, default))
            .Returns(Task.FromResult(string.Empty));
        var entityServiceMock = new Mock<IEntityService>();
        entityServiceMock.Setup(s => s.ContactsAsync("", default))
            .Returns(Task.FromResult(new List<IContact>
            {
                new Contact("", "signalco", "configuration", JsonSerializer.Serialize<object>(new ProcessConfiguration
                {
                    Schema = "",
                    Type = ProcessType.Basic,
                    Conducts = new List<Conduct>
                    {
                        new ConductEntityContact
                        {
                            Type = "contact",
                            Id = Guid.NewGuid().ToString(),
                            Conditions = new List<Condition>
                            {
                                new ConditionCompare
                                {
                                    Type = "compare",
                                    Left = new ConditionContact
                                    {
                                        Type = "contact",
                                        ContactPointer = new Configuration.Schemas.ContactPointer
                                        {
                                            ChannelName = "test",
                                            ContactName = "test",
                                            EntityId = "test"
                                        }
                                    },
                                    Operation = CompareOperation.Equal,
                                    Right = new ConditionConst
                                    {
                                        Type = "value",
                                        ValueSerialized = "True"
                                    }
                                }
                            },
                            Contacts = new List<ConductContact>()
                        }
                    }
                }), DateTime.UtcNow, null)
            }.AsEnumerable()));
        entityServiceMock.Setup(s => s.ContactAsync(new ContactPointer("test", "test", "test"), default))
            .Returns(Task.FromResult((IContact) new Contact("test", "test", "test", "False", DateTime.UtcNow, null))!);

        var processor = Processor(
            (typeof(IEntityService), entityServiceMock.Object),
            (typeof(ISecretsProvider), secretsProviderMock.Object));
        await processor.RunProcessAsync("", new ContactPointer("test", "test", "test"), false);
    }

    [Fact]
    public async Task Processor_TriggerContact_ShouldNotTrigger()
    {
        var secretsProviderMock = new Mock<ISecretsProvider>();
        secretsProviderMock
            .Setup(s => s.GetSecretAsync(SecretKeys.ProcessorAccessCode, default))
            .Returns(Task.FromResult(string.Empty));
        var entityServiceMock = new Mock<IEntityService>();
        entityServiceMock.Setup(s => s.ContactsAsync("", default))
            .Returns(Task.FromResult(new List<IContact>
            {
                new Contact("", "signalco", "configuration", JsonSerializer.Serialize<object>(new ProcessConfiguration
                {
                    Schema = "",
                    Type = ProcessType.Basic,
                    Conducts = new List<Conduct>
                    {
                        new ConductEntityContact
                        {
                            Type = "contact",
                            Id = Guid.NewGuid().ToString(),
                            Conditions = new List<Condition>
                            {
                                new ConditionCompare
                                {
                                    Type = "compare",
                                    Left = new ConditionContact
                                    {
                                        Type = "contact",
                                        ContactPointer = new Configuration.Schemas.ContactPointer
                                        {
                                            ChannelName = "test",
                                            ContactName = "test",
                                            EntityId = "test"
                                        }
                                    },
                                    Operation = CompareOperation.Equal,
                                    Right = new ConditionConst
                                    {
                                        Type = "value",
                                        ValueSerialized = "True"
                                    }
                                }
                            },
                            Contacts = new List<ConductContact>()
                        }
                    }
                }), DateTime.UtcNow, null)
            }.AsEnumerable()));
        entityServiceMock.Setup(s => s.ContactAsync(new ContactPointer("test", "test", "test"), default))
            .Returns(Task.FromResult((IContact)new Contact("test", "test", "test", "False", DateTime.UtcNow, null))!);

        var processor = Processor(
            (typeof(IEntityService), entityServiceMock.Object),
            (typeof(ISecretsProvider), secretsProviderMock.Object));
        await processor.RunProcessAsync("", new ContactPointer("test", "test", "other"), false);
    }

    [Fact]
    public async Task Processor_TriggerContact_Compare()
    {
        var secretsProviderMock = new Mock<ISecretsProvider>();
        secretsProviderMock
            .Setup(s => s.GetSecretAsync(SecretKeys.ProcessorAccessCode, default))
            .Returns(Task.FromResult(string.Empty));
        var processServiceMock = new Mock<IProcessService>();
        processServiceMock.Setup(s => s.GetConfigurationAsync("", default))
            .Returns(Task.FromResult(new ProcessConfiguration
            {
                Schema = "",
                Type = ProcessType.Basic,
                Conducts = new List<Conduct>
                    {
                        new ConductEntityContact
                        {
                            Type = "contact",
                            Id = Guid.NewGuid().ToString(),
                            Conditions = new List<Condition>
                            {
                                new ConditionOrGroup
                                {
                                    Type = "orGroup",
                                    Conditions = new List<Condition>
                                    {
                                        new ConditionCompare
                                        {
                                            Type = "compare",
                                            Left = new ConditionContact
                                            {
                                                Type = "contact",
                                                ContactPointer = new Configuration.Schemas.ContactPointer
                                                {
                                                    ChannelName = "test",
                                                    ContactName = "test",
                                                    EntityId = "test"
                                                }
                                            },
                                            Operation = CompareOperation.Equal,
                                            Right = new ConditionConst
                                            {
                                                Type = "value",
                                                ValueSerialized = "on"
                                            }
                                        },
                                        new ConditionCompare
                                        {
                                            Type = "compare",
                                            Left = new ConditionConst
                                            {
                                                Type = "value",
                                                ValueSerialized = "True"
                                            },
                                            Operation = CompareOperation.Equal,
                                            Right = new ConditionConst
                                            {
                                                Type = "value",
                                                ValueSerialized = "True"
                                            }
                                        }
                                    }
                                }
                            },
                            Contacts = new List<ConductContact>()
                        }
                    }
            }));
        var entityServiceMock = new Mock<IEntityService>();
        entityServiceMock.Setup(s => s.ContactAsync(new ContactPointer("test", "test", "test"), default))
            .Returns(Task.FromResult((IContact)new Contact("test", "test", "test", "on", DateTime.UtcNow, null))!);

        var processor = Processor(
            (typeof(IEntityService), entityServiceMock.Object),
            (typeof(ISecretsProvider), secretsProviderMock.Object),
            (typeof(IProcessService), processServiceMock.Object));
        await processor.RunProcessAsync("", new ContactPointer("test", "test", "test"), false);
    }

    [Fact]
    public async Task Processor_TriggerContact_OrGroup()
    {
        var secretsProviderMock = new Mock<ISecretsProvider>();
        secretsProviderMock
            .Setup(s => s.GetSecretAsync(SecretKeys.ProcessorAccessCode, default))
            .Returns(Task.FromResult(string.Empty));
        var entityServiceMock = new Mock<IEntityService>();
        entityServiceMock.Setup(s => s.ContactsAsync("", default))
            .Returns(Task.FromResult(new List<IContact>
            {
                new Contact("", "signalco", "configuration", JsonSerializer.Serialize<object>(new ProcessConfiguration
                {
                    Schema = "",
                    Type = ProcessType.Basic,
                    Conducts = new List<Conduct>
                    {
                        new ConductEntityContact
                        {
                            Type = "contact",
                            Id = Guid.NewGuid().ToString(),
                            Conditions = new List<Condition>
                            {
                                new ConditionOrGroup
                                {
                                    Type = "orGroup",
                                    Conditions = new List<Condition>
                                    {
                                        new ConditionCompare
                                        {
                                            Type = "compare",
                                            Left = new ConditionContact
                                            {
                                                Type = "contact",
                                                ContactPointer = new Configuration.Schemas.ContactPointer
                                                {
                                                    ChannelName = "test",
                                                    ContactName = "test",
                                                    EntityId = "test"
                                                }
                                            },
                                            Operation = CompareOperation.Equal,
                                            Right = new ConditionConst
                                            {
                                                Type = "value",
                                                ValueSerialized = "True"
                                            }
                                        },
                                        new ConditionCompare
                                        {
                                            Type = "compare",
                                            Left = new ConditionConst
                                            {
                                                Type = "value",
                                                ValueSerialized = "True"
                                            },
                                            Operation = CompareOperation.Equal,
                                            Right = new ConditionConst
                                            {
                                                Type = "value",
                                                ValueSerialized = "True"
                                            }
                                        }
                                    }
                                }
                            },
                            Contacts = new List<ConductContact>()
                        }
                    }
                }), DateTime.UtcNow, null)
            }.AsEnumerable()));
        entityServiceMock.Setup(s => s.ContactAsync(new ContactPointer("test", "test", "test"), default))
            .Returns(Task.FromResult((IContact) new Contact("test", "test", "test", "False", DateTime.UtcNow, null))!);

        var processor = Processor(
            (typeof(IEntityService), entityServiceMock.Object),
            (typeof(ISecretsProvider), secretsProviderMock.Object));
        await processor.RunProcessAsync("", new ContactPointer("test", "test", "test"), false);
    }

    private static IProcessor Processor(params (Type type, object instance)[] mocks)
    {
        var services = new ServiceCollection();
        services.AddCore();
        services.AddSecrets();
        services.AddProcessor();
        foreach (var mock in mocks) 
            services.AddSingleton(mock.type, mock.instance);
        var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<IProcessor>();
    }
}