import { testHelper } from '@/__tests__/helpers/testHelpers'
import getData from './getData'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

testHelper.mockConsole()

process.env = {
  NODE_ENV: 'test',
  CONTENTFUL_ENVIRONMENT: ''
}

describe('getData', () => {
  beforeEach(() => {
    // Clear and reset fetch mocks before each test
    fetchMock.resetMocks()
  })
  it('successful fetch unauthenticated', async() => {
    const fetchResponse = {
      data: {
        query: 'query'
      }
    }
    fetchMock.mockResponseOnce(JSON.stringify(fetchResponse))

    const daprUrl = 'http://localhost:3500/v1.0/invoke/backend/method/graphql'
    const query = 'query'

    const res = await getData(query)
    expect(fetchMock).toHaveBeenCalledWith(
      daprUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Environment: '',
          SourceSystem: 'myRAC'
        },
        body: JSON.stringify({ query })
      }
    )
    expect(res).toEqual(fetchResponse.data)
  })
  it('successful fetch authenticated', async() => {
    const fetchResponse = {
      data: {
        query: 'query'
      }
    }
    fetchMock.mockResponseOnce(JSON.stringify(fetchResponse))

    const daprUrl = 'http://localhost:3500/v1.0/invoke/backend/method/graphql'
    const query = 'query'
    const token = 'token'

    const res = await getData(query, token)
    expect(fetchMock).toHaveBeenCalledWith(
      daprUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Environment: '',
          SourceSystem: 'myRAC'
        },
        body: JSON.stringify({ query })
      }
    )
    expect(res).toEqual(fetchResponse.data)
  })
  it('unsuccessful fetch unauthenticated but should be', async() => {
    const fetchResponse = {
      errors: [{
        message: 'Unauthorized'
      }]
    }
    fetchMock.mockResponseOnce(JSON.stringify(fetchResponse), { status: 500 })

    const daprUrl = 'http://localhost:3500/v1.0/invoke/backend/method/graphql'
    const query = 'query'

    await expect(getData(query)).rejects.toThrow(
      'Unauthorized'
    )
    expect(fetchMock).toHaveBeenCalledWith(
      daprUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Environment: '',
          SourceSystem: 'myRAC'
        },
        body: JSON.stringify({ query })
      }
    )
  })
  it('unsuccessful fetch non-auth error', async() => {
    const fetchResponse = {
      errors: [{
        message: 'Any other error'
      }]
    }
    fetchMock.mockResponseOnce(JSON.stringify(fetchResponse), { status: 500 })

    const daprUrl = 'http://localhost:3500/v1.0/invoke/backend/method/graphql'
    const query = 'query'

    const res = await getData(query)
    expect(fetchMock).toHaveBeenCalledWith(
      daprUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Environment: '',
          SourceSystem: 'myRAC'
        },
        body: JSON.stringify({ query })
      }
    )
    expect(res).toEqual(fetchResponse)
  })
  it('unsuccessful fetch no error but failed status', async() => {
    const fetchResponse = {
      data: ''
    }
    fetchMock.mockResponseOnce(JSON.stringify(fetchResponse), { status: 500 })

    const daprUrl = 'http://localhost:3500/v1.0/invoke/backend/method/graphql'
    const query = 'query'

    const res = await getData(query)
    expect(fetchMock).toHaveBeenCalledWith(
      daprUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Environment: '',
          SourceSystem: 'myRAC'
        },
        body: JSON.stringify({ query })
      }
    )
    expect(res).toEqual(undefined)
  })
})
