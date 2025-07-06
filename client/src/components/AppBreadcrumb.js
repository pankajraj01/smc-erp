import React from 'react'
import { useLocation, matchPath } from 'react-router-dom'

import routes from '../routes'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    for (const route of routes) {
      const match = matchPath({ path: route.path, end: true }, pathname)
      if (match) {
        if (route.name?.includes(':')) {
          // Replace param placeholders like ':neftId' with actual values
          let name = route.name
          Object.entries(match.params).forEach(([key, value]) => {
            name = name.replace(`:${key}`, value)
          })
          return name
        }
        return route.name
      }
    }
    return false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    const pathSegments = location.split('/').filter(Boolean)

    pathSegments.reduce((prevPath, currSegment, index, array) => {
      const currentPathname = `${prevPath}/${currSegment}`
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        })
      }
      return currentPathname
    }, '')
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
